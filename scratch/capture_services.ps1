param()

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$port = 9245
$tempDir = Join-Path $env:TEMP "chrome_serv_$([guid]::NewGuid().ToString('N'))"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

$proc = Start-Process -FilePath $chrome -ArgumentList @(
    "--remote-debugging-port=$port",
    "--headless=new",
    "--user-data-dir=`"$tempDir`"",
    "--no-first-run",
    "--disable-gpu",
    "--window-size=1440,1200"
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

    function Recv-Message([int]$expectedId, [int]$timeoutMs = 6000) {
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
                        if ($json.id -eq $expectedId) {
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

    $navId = Send-Cmd "Page.navigate" @{ url = "http://localhost:5173/" }
    Recv-Message $navId 5000 | Out-Null
    Start-Sleep -Seconds 2

    $clickAndScroll = @'
    // Open all 6 services
    const btns = document.querySelectorAll('#services [role="button"]');
    btns.forEach(b => b.click());
    
    // Scroll directly to the top of #services with 50px offset
    const el = document.getElementById('services');
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    window.scrollTo({ top: rect.top + scrollTop - 40, behavior: 'instant' });
'@
    $evalId = Send-Cmd "Runtime.evaluate" @{ expression = $clickAndScroll }
    Recv-Message $evalId 2000 | Out-Null
    Start-Sleep -Milliseconds 1000

    $shotId = Send-Cmd "Page.captureScreenshot" @{ format = "png" }
    $shotResp = Recv-Message $shotId 8000
    if ($shotResp -and $shotResp.result.data) {
        [System.IO.File]::WriteAllBytes("screenshots/services_all_open.png", [System.Convert]::FromBase64String($shotResp.result.data))
        Write-Host "Saved screenshots/services_all_open.png"
    }

} finally {
    try { $ws.Dispose() } catch {}
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
