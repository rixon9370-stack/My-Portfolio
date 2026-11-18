param()

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$port = 9240
$tempDir = Join-Path $env:TEMP "chrome_verify_$([guid]::NewGuid().ToString('N'))"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

$proc = Start-Process -FilePath $chrome -ArgumentList @(
    "--remote-debugging-port=$port",
    "--headless=new",
    "--user-data-dir=`"$tempDir`"",
    "--no-first-run",
    "--disable-gpu",
    "--window-size=1440,1080"
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

    # 1. Enable Page
    Send-Cmd "Page.enable" | Out-Null
    Send-Cmd "Runtime.enable" | Out-Null

    # 2. Navigate to Home
    $navId = Send-Cmd "Page.navigate" @{ url = "http://localhost:5173/" }
    Recv-Message $navId 5000 | Out-Null
    Start-Sleep -Seconds 2

    # Verify About section: Scroll to #about and take screenshot
    $scrollAbout = @'
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'instant' });
'@
    $evalId = Send-Cmd "Runtime.evaluate" @{ expression = $scrollAbout }
    Recv-Message $evalId 2000 | Out-Null
    Start-Sleep -Milliseconds 800

    $shotId = Send-Cmd "Page.captureScreenshot" @{ format = "png" }
    $shotResp = Recv-Message $shotId 8000
    if ($shotResp -and $shotResp.result.data) {
        [System.IO.File]::WriteAllBytes("screenshots/about_verified.png", [System.Convert]::FromBase64String($shotResp.result.data))
        Write-Host "Saved screenshots/about_verified.png"
    }

    # Verify Services section: Click open each service box, scroll and capture
    $openServices = @'
    const serviceButtons = document.querySelectorAll('#services [role="button"]');
    serviceButtons.forEach(btn => btn.click());
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'instant' });
'@
    $evalId = Send-Cmd "Runtime.evaluate" @{ expression = $openServices }
    Recv-Message $evalId 2000 | Out-Null
    Start-Sleep -Milliseconds 800

    $shotId = Send-Cmd "Page.captureScreenshot" @{ format = "png" }
    $shotResp = Recv-Message $shotId 8000
    if ($shotResp -and $shotResp.result.data) {
        [System.IO.File]::WriteAllBytes("screenshots/services_verified.png", [System.Convert]::FromBase64String($shotResp.result.data))
        Write-Host "Saved screenshots/services_verified.png"
    }

    # Verify Workflow section: Scroll to #workflow and capture screenshot
    $scrollWorkflow = @'
    const el = document.getElementById('workflow');
    if (el) el.scrollIntoView({ behavior: 'instant' });
'@
    $evalId = Send-Cmd "Runtime.evaluate" @{ expression = $scrollWorkflow }
    Recv-Message $evalId 2000 | Out-Null
    Start-Sleep -Milliseconds 800

    $shotId = Send-Cmd "Page.captureScreenshot" @{ format = "png" }
    $shotResp = Recv-Message $shotId 8000
    if ($shotResp -and $shotResp.result.data) {
        [System.IO.File]::WriteAllBytes("screenshots/workflow_verified.png", [System.Convert]::FromBase64String($shotResp.result.data))
        Write-Host "Saved screenshots/workflow_verified.png"
    }

    # Verify Footer: Scroll to bottom and capture screenshot
    $scrollFooter = @'
    window.scrollTo(0, document.body.scrollHeight);
'@
    $evalId = Send-Cmd "Runtime.evaluate" @{ expression = $scrollFooter }
    Recv-Message $evalId 2000 | Out-Null
    Start-Sleep -Milliseconds 800

    $shotId = Send-Cmd "Page.captureScreenshot" @{ format = "png" }
    $shotResp = Recv-Message $shotId 8000
    if ($shotResp -and $shotResp.result.data) {
        [System.IO.File]::WriteAllBytes("screenshots/footer_verified.png", [System.Convert]::FromBase64String($shotResp.result.data))
        Write-Host "Saved screenshots/footer_verified.png"
    }

    # Extract DOM verification info
    $verifyDom = @'
    ({
        workflowCardsCount: document.querySelectorAll('#workflow .grid > div').length,
        workflowTextContainsColonOrSemicolon: Array.from(document.querySelectorAll('#workflow p, #workflow h2, #workflow h3')).some(el => el.textContent.includes(':') || el.textContent.includes(';')),
        serviceDefinitionsWithHyphens: Array.from(document.querySelectorAll('#services p')).filter(el => el.textContent.includes('-')).map(el => el.textContent),
        aboutContainsMetaGoogle: document.getElementById('about') ? document.getElementById('about').textContent.includes('Meta and Google') : false,
        aboutExperience: Array.from(document.querySelectorAll('#about .grid span')).map(s => s.textContent.trim()).filter(t => t.includes('Experience') || t.includes('1 Year')),
        footerLinks: Array.from(document.querySelectorAll('footer a')).map(a => a.textContent.trim())
    })
'@
    $evalId = Send-Cmd "Runtime.evaluate" @{ expression = $verifyDom; returnByValue = $true }
    $evalResp = Recv-Message $evalId 3000
    if ($evalResp -and $evalResp.result -and $evalResp.result.result) {
        Write-Host "=== DOM VERIFICATION REPORT ==="
        $evalResp.result.result.value | ConvertTo-Json -Depth 5 | Write-Host
    }

} finally {
    try { $ws.Dispose() } catch {}
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
