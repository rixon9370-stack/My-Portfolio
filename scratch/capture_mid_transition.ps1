param()

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$port = 9260
$tempDir = Join-Path $env:TEMP "chrome_transition_$([guid]::NewGuid().ToString('N'))"
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
    Start-Sleep -Seconds 3

    # Check 1: Mid-transition between Cinematic (pinned at top) and Fashion & Jewellery (sliding up)
    $evalMid = @'
    (() => {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo({ top: 450, behavior: 'instant' });
        const c = document.getElementById('cinematic');
        const f = document.getElementById('fashion-jewellery');
        const cRect = c.getBoundingClientRect();
        const fRect = f.getBoundingClientRect();
        return {
            windowScrollY: window.scrollY,
            viewportHeight: window.innerHeight,
            cinematic: {
                top: cRect.top,
                bottom: cRect.bottom,
                height: cRect.height,
                isPinnedAtTop: cRect.top === 0
            },
            fashionJewellery: {
                top: fRect.top,
                bottom: fRect.bottom,
                height: fRect.height,
                isCoveringCinematic: fRect.top < cRect.bottom && fRect.top > 0
            }
        };
    })()
'@
    $evalId = Send-Cmd "Runtime.evaluate" @{ expression = $evalMid; returnByValue = $true }
    $resMid = Recv-Message $evalId 3000
    Write-Host "=== MID-TRANSITION MEASUREMENTS (CINEMATIC -> FASHION) ==="
    $resMid.result.result.value | ConvertTo-Json -Depth 5 | Write-Host

    Start-Sleep -Milliseconds 500
    $shotId = Send-Cmd "Page.captureScreenshot" @{ format = "png" }
    $shotResp = Recv-Message $shotId 8000
    if ($shotResp -and $shotResp.result.data) {
        [System.IO.File]::WriteAllBytes("screenshots/work_mid_transition.png", [System.Convert]::FromBase64String($shotResp.result.data))
        Write-Host "Saved screenshots/work_mid_transition.png"
    }

    # Check 2: Mid-transition between Fashion (pinned at top) and Commercial (sliding up)
    $evalMid2 = @'
    (() => {
        window.scrollTo({ top: 1350, behavior: 'instant' });
        const f = document.getElementById('fashion-jewellery');
        const comm = document.getElementById('commercial');
        const fRect = f.getBoundingClientRect();
        const commRect = comm.getBoundingClientRect();
        return {
            windowScrollY: window.scrollY,
            fashionJewellery: {
                top: fRect.top,
                bottom: fRect.bottom,
                isPinnedAtTop: fRect.top === 0
            },
            commercial: {
                top: commRect.top,
                bottom: commRect.bottom,
                isCoveringFashion: commRect.top < fRect.bottom && commRect.top > 0
            }
        };
    })()
'@
    $evalId2 = Send-Cmd "Runtime.evaluate" @{ expression = $evalMid2; returnByValue = $true }
    $resMid2 = Recv-Message $evalId2 3000
    Write-Host "`n=== MID-TRANSITION MEASUREMENTS (FASHION -> COMMERCIAL) ==="
    $resMid2.result.result.value | ConvertTo-Json -Depth 5 | Write-Host

    Start-Sleep -Milliseconds 500
    $shotId2 = Send-Cmd "Page.captureScreenshot" @{ format = "png" }
    $shotResp2 = Recv-Message $shotId2 8000
    if ($shotResp2 -and $shotResp2.result.data) {
        [System.IO.File]::WriteAllBytes("screenshots/work_mid_transition_commercial.png", [System.Convert]::FromBase64String($shotResp2.result.data))
        Write-Host "Saved screenshots/work_mid_transition_commercial.png"
    }

} finally {
    try { $ws.Dispose() } catch {}
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
