param(
    [string]$TargetUrl = "https://rixon-sunny.vercel.app",
    [string]$CategoryPath = "pages/cinematic.html"
)

Add-Type -AssemblyName System.Net.Http

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$port = 9222
$tempDir = Join-Path $env:TEMP "chrome_profile_$([guid]::NewGuid().ToString('N'))"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

$proc = Start-Process -FilePath $chrome -ArgumentList @(
    "--remote-debugging-port=$port",
    "--headless=new",
    "--user-data-dir=`"$tempDir`"",
    "--no-first-run",
    "--disable-gpu",
    "--window-size=1440,900"
) -PassThru

Start-Sleep -Seconds 2

try {
    $pages = Invoke-RestMethod -Uri "http://127.0.0.1:$port/json"
    $wsUrl = $pages[0].webSocketDebuggerUrl
    Write-Host "Connecting to WebSocket: $wsUrl"

    $ws = [System.Net.WebSockets.ClientWebSocket]::new()
    $cts = [System.Threading.CancellationTokenSource]::new()
    $ws.ConnectAsync([uri]$wsUrl, $cts.Token).Wait()

    $cmdId = 1
    function Send-CDPCommand([string]$method, [hashtable]$params = @{}) {
        $id = $cmdId
        $script:cmdId++
        $payload = @{
            id = $id
            method = $method
            params = $params
        } | ConvertTo-Json -Compress -Depth 10
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
        $segment = [System.ArraySegment[byte]]::new($bytes)
        $ws.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token).Wait()
        return $id
    }

    # Data collectors
    $networkRequests = [System.Collections.Generic.List[hashtable]]::new()
    $networkResponses = [System.Collections.Generic.List[hashtable]]::new()
    $networkFailed = [System.Collections.Generic.List[hashtable]]::new()
    $consoleMessages = [System.Collections.Generic.List[hashtable]]::new()

    # Enable domains
    [void](Send-CDPCommand "Network.enable")
    [void](Send-CDPCommand "Page.enable")
    [void](Send-CDPCommand "Console.enable")
    [void](Send-CDPCommand "Runtime.enable")

    # Background reader task
    $readLoop = [runspacefactory]::CreateRunspace()
    
    # We will poll messages synchronously using a helper
    function Receive-Messages([int]$timeoutMs = 1000) {
        $buffer = [byte[]]::new(65536)
        $sb = [System.Text.StringBuilder]::new()
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

        while ($stopwatch.ElapsedMilliseconds -lt $timeoutMs -and $ws.State -eq [System.Net.WebSockets.WebSocketState]::Open) {
            $segment = [System.ArraySegment[byte]]::new($buffer)
            $tokenSource = [System.Threading.CancellationTokenSource]::new(200)
            try {
                $task = $ws.ReceiveAsync($segment, $tokenSource.Token)
                $task.Wait()
                $result = $task.Result
                if ($result.Count -gt 0) {
                    $chunk = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $result.Count)
                    [void]$sb.Append($chunk)
                    if ($result.EndOfMessage) {
                        $json = $sb.ToString()
                        $sb.Clear()
                        try {
                            $msg = $json | ConvertFrom-Json
                            if ($msg.method -eq "Network.requestWillBeSent") {
                                $networkRequests.Add(@{
                                    requestId = $msg.params.requestId
                                    url = $msg.params.request.url
                                    method = $msg.params.request.method
                                    type = $msg.params.type
                                    time = [datetime]::Now
                                })
                            } elseif ($msg.method -eq "Network.responseReceived") {
                                $networkResponses.Add(@{
                                    requestId = $msg.params.requestId
                                    url = $msg.params.response.url
                                    status = $msg.params.response.status
                                    statusText = $msg.params.response.statusText
                                    mimeType = $msg.params.response.mimeType
                                    headers = $msg.params.response.headers
                                })
                            } elseif ($msg.method -eq "Network.loadingFailed") {
                                $networkFailed.Add(@{
                                    requestId = $msg.params.requestId
                                    errorText = $msg.params.errorText
                                    canceled = $msg.params.canceled
                                })
                            } elseif ($msg.method -eq "Console.messageAdded") {
                                $consoleMessages.Add(@{
                                    level = $msg.params.message.level
                                    text = $msg.params.message.text
                                    url = $msg.params.message.url
                                    line = $msg.params.message.line
                                })
                            } elseif ($msg.method -eq "Runtime.consoleAPICalled") {
                                $text = ($msg.params.args | ForEach-Object { $_.value }) -join " "
                                $consoleMessages.Add(@{
                                    level = $msg.params.type
                                    text = $text
                                })
                            } elseif ($msg.method -eq "Runtime.exceptionThrown") {
                                $consoleMessages.Add(@{
                                    level = "error"
                                    text = $msg.params.exceptionDetails.exception.description
                                })
                            }
                        } catch {}
                    }
                }
            } catch {
                # timeout on receive, normal
            }
        }
    }

    Write-Host "`n>>> PART 1: HOMEPAGE TEST ($TargetUrl)"
    [void](Send-CDPCommand "Page.navigate" @{ url = $TargetUrl })
    Receive-Messages 3000

    Write-Host "Scrolling through homepage to trigger intersection observers..."
    for ($i = 0; $i -le 10; $i++) {
        $scrollY = $i * 600
        $expr = "window.scrollTo(0, $scrollY); 'scrolled to $scrollY'"
        [void](Send-CDPCommand "Runtime.evaluate" @{ expression = $expr })
        Receive-Messages 600
    }

    # Evaluate DOM video states
    $evalDomVideos = @"
Array.from(document.querySelectorAll('video')).map(v => ({
    id: v.id,
    className: v.className,
    src: v.src,
    currentSrc: v.currentSrc,
    datasetSrc: v.dataset.src,
    paused: v.paused,
    readyState: v.readyState,
    networkState: v.networkState,
    videoWidth: v.videoWidth,
    videoHeight: v.videoHeight,
    error: v.error ? { code: v.error.code, message: v.error.message } : null
}))
"@
    $id = Send-CDPCommand "Runtime.evaluate" @{ expression = $evalDomVideos; returnByValue = $true }
    Receive-Messages 1500

    Write-Host "`n=== ALL .MP4 REQUESTS ON HOMEPAGE ==="
    $mp4Requests = $networkRequests | Where-Object { $_.url -like "*.mp4*" }
    if ($mp4Requests.Count -eq 0) {
        Write-Host "NO .mp4 requests were initiated!"
    } else {
        foreach ($req in $mp4Requests) {
            $resp = $networkResponses | Where-Object { $_.requestId -eq $req.requestId }
            $fail = $networkFailed | Where-Object { $_.requestId -eq $req.requestId }
            $status = if ($resp) { "$($resp.status) $($resp.statusText)" } elseif ($fail) { "FAILED: $($fail.errorText)" } else { "PENDING / IN-FLIGHT" }
            Write-Host "URL: $($req.url)"
            Write-Host "  Method: $($req.method) | Status: $status"
        }
    }

    Write-Host "`n=== HOMEPAGE CONSOLE MESSAGES ==="
    if ($consoleMessages.Count -eq 0) {
        Write-Host "No console messages recorded."
    } else {
        foreach ($c in $consoleMessages) {
            Write-Host "[$($c.level)] $($c.text)"
        }
    }

    # Clear lists for Part 2
    $networkRequests.Clear()
    $networkResponses.Clear()
    $networkFailed.Clear()
    $consoleMessages.Clear()

    Write-Host "`n>>> PART 2: CATEGORY PAGE TEST ($TargetUrl/$CategoryPath)"
    [void](Send-CDPCommand "Page.navigate" @{ url = "$TargetUrl/$CategoryPath" })
    Receive-Messages 4000

    Write-Host "`n=== REQUESTS FOR works.json ==="
    $jsonRequests = $networkRequests | Where-Object { $_.url -like "*works.json*" }
    if ($jsonRequests.Count -eq 0) {
        Write-Host "NO works.json requests were made!"
    } else {
        foreach ($req in $jsonRequests) {
            $resp = $networkResponses | Where-Object { $_.requestId -eq $req.requestId }
            $fail = $networkFailed | Where-Object { $_.requestId -eq $req.requestId }
            $status = if ($resp) { "$($resp.status) $($resp.statusText)" } elseif ($fail) { "FAILED: $($fail.errorText)" } else { "PENDING / IN-FLIGHT" }
            Write-Host "URL: $($req.url)"
            Write-Host "  Method: $($req.method) | Status: $status"
        }
    }

    Write-Host "`n=== ALL FAILED NETWORK REQUESTS ON CATEGORY PAGE ==="
    foreach ($fail in $networkFailed) {
        $req = $networkRequests | Where-Object { $_.requestId -eq $fail.requestId }
        Write-Host "FAILED: $($req.url) -> $($fail.errorText)"
    }

    Write-Host "`n=== ALL 4xx/5xx RESPONSES ON CATEGORY PAGE ==="
    foreach ($resp in ($networkResponses | Where-Object { $_.status -ge 400 })) {
        Write-Host "HTTP $($resp.status): $($resp.url)"
    }

    Write-Host "`n=== CATEGORY PAGE CONSOLE ERRORS ==="
    $errors = $consoleMessages | Where-Object { $_.level -eq "error" }
    if ($errors.Count -eq 0) {
        Write-Host "No console errors recorded."
    } else {
        foreach ($c in $errors) {
            Write-Host "[$($c.level)] $($c.text)"
        }
    }

    # Check DOM state on category page
    $evalCategoryDom = @"
({
    category: document.body.dataset.category,
    countText: document.getElementById('categoryCount') ? document.getElementById('categoryCount').textContent : null,
    emptyStateDisplay: document.getElementById('categoryEmptyState') ? document.getElementById('categoryEmptyState').style.display : null,
    landscapeGridCards: document.getElementById('categoryLandscapeGrid') ? document.getElementById('categoryLandscapeGrid').children.length : 0,
    verticalGridCards: document.getElementById('categoryVerticalGrid') ? document.getElementById('categoryVerticalGrid').children.length : 0
})
"@
    $id = Send-CDPCommand "Runtime.evaluate" @{ expression = $evalCategoryDom; returnByValue = $true }
    Receive-Messages 1500

} finally {
    try { $ws.Dispose() } catch {}
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
