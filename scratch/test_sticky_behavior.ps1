param()

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$port = 9253
$tempDir = Join-Path $env:TEMP "chrome_test2_$([guid]::NewGuid().ToString('N'))"
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

    $ws = [System.Net.WebSockets.ClientWebSocket]::new()
    $cts = [System.Threading.CancellationTokenSource]::new()
    $ws.ConnectAsync([uri]$wsUrl, $cts.Token).Wait()

    $cmdId = 1
    function Send-Cmd([string]$method, [hashtable]$params = @{}) {
        $id = $script:cmdId++
        $payload = @{ id = $id; method = $method; params = $params } | ConvertTo-Json -Compress -Depth 10
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
        $segment = [System.ArraySegment[byte]]::new($bytes)
        $ws.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token).Wait()
        return $id
    }

    function Recv-Message([int]$expectedId = -1, [int]$timeoutMs = 6000) {
        $buffer = [byte[]]::new(1048576)
        $sb = [System.Text.StringBuilder]::new()
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        while ($sw.ElapsedMilliseconds -lt $timeoutMs) {
            $segment = [System.ArraySegment[byte]]::new($buffer)
            $t = $ws.ReceiveAsync($segment, $cts.Token)
            $t.Wait()
            if ($t.Result.Count -gt 0) {
                $chunk = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $t.Result.Count)
                [void]$sb.Append($chunk)
                if ($t.Result.EndOfMessage) {
                    $raw = $sb.ToString()
                    $sb.Clear()
                    try {
                        $json = $raw | ConvertFrom-Json
                        if ($expectedId -ge 0 -and $json.id -eq $expectedId) {
                            return $json
                        }
                    } catch {}
                }
            }
        }
        return $null
    }

    Send-Cmd "Page.enable" | Out-Null
    Send-Cmd "Runtime.enable" | Out-Null

    $navId = Send-Cmd "Page.navigate" @{ url = "http://localhost:3000/work" }
    Recv-Message $navId 5000 | Out-Null
    Start-Sleep -Seconds 2

    $testScroll = @'
    (() => {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo({ top: 400, behavior: 'instant' });
        const c = document.getElementById('cinematic');
        const f = document.getElementById('fashion-jewellery');
        const cRect = c.getBoundingClientRect();
        const fRect = f.getBoundingClientRect();
        return {
            windowScrollY: window.scrollY,
            scrollingElement: document.scrollingElement.tagName,
            documentScrollTop: document.documentElement.scrollTop,
            bodyScrollTop: document.body.scrollTop,
            cinematicTop: cRect.top,
            cinematicBottom: cRect.bottom,
            fashionTop: fRect.top,
            fashionBottom: fRect.bottom,
            isCinematicAtTop: cRect.top === 0,
            isFashionCoveringCinematic: fRect.top < cRect.bottom && fRect.top > 0
        };
    })()
'@
    $evalId = Send-Cmd "Runtime.evaluate" @{ expression = $testScroll; returnByValue = $true }
    $res = Recv-Message $evalId 3000
    Write-Host "Instant scroll to 400px result:"
    $res.result.result.value | ConvertTo-Json | Write-Host

} finally {
    try { $ws.Dispose() } catch {}
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
