param(
    [string]$TargetUrl = "http://localhost:3000/work"
)

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$port = 9250
$tempDir = Join-Path $env:TEMP "chrome_diag_$([guid]::NewGuid().ToString('N'))"
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

    $consoleLogs = [System.Collections.Generic.List[string]]::new()
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
                        if ($json.method -eq "Log.entryAdded" -or $json.method -eq "Console.messageAdded") {
                            $consoleLogs.Add($raw)
                        }
                        if ($expectedId -ge 0 -and $json.id -eq $expectedId) {
                            return $json
                        }
                    } catch {}
                }
            }
        }
        return $null
    }

    Send-Cmd "Log.enable" | Out-Null
    Send-Cmd "Console.enable" | Out-Null
    Send-Cmd "Page.enable" | Out-Null
    Send-Cmd "Runtime.enable" | Out-Null

    $navId = Send-Cmd "Page.navigate" @{ url = $TargetUrl }
    Recv-Message $navId 5000 | Out-Null
    Start-Sleep -Seconds 3

    # Check 1: What renders on http://localhost:3000/work
    $check1 = @'
    ({
        url: window.location.href,
        title: document.title,
        bodyTextSnippet: document.body.innerText.substring(0, 500),
        renderedHeading: document.querySelector('h1, h2') ? document.querySelector('h1, h2').innerText : 'None',
        allHeadings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText)
    })
'@
    $evalId = Send-Cmd "Runtime.evaluate" @{ expression = $check1; returnByValue = $true }
    $res1 = Recv-Message $evalId 3000

    # Check 2: DOM elements present on /work
    $check2 = @'
    ({
        sectionsCount: document.querySelectorAll('#cinematic, #fashion-jewellery, #commercial, #brand-films, #food-retail, #app-promos').length,
        foundIds: Array.from(document.querySelectorAll('a, section, div')).filter(el => ['cinematic', 'fashion-jewellery', 'commercial', 'brand-films', 'food-retail', 'app-promos'].includes(el.id)).map(el => ({
            id: el.id,
            tagName: el.tagName,
            className: el.className,
            titleText: el.querySelector('h2') ? el.querySelector('h2').innerText : null
        }))
    })
'@
    $evalId = Send-Cmd "Runtime.evaluate" @{ expression = $check2; returnByValue = $true }
    $res2 = Recv-Message $evalId 3000

    # Check 3: Computed CSS for sections
    $check3 = @'
    Array.from(document.querySelectorAll('#cinematic, #fashion-jewellery, #commercial, #brand-films, #food-retail, #app-promos')).map(el => {
        const cs = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
            id: el.id,
            position: cs.position,
            top: cs.top,
            height: cs.height,
            zIndex: cs.zIndex,
            display: cs.display,
            inlineStyleZIndex: el.style.zIndex,
            rectTop: rect.top,
            rectHeight: rect.height
        };
    })
'@
    $evalId = Send-Cmd "Runtime.evaluate" @{ expression = $check3; returnByValue = $true }
    $res3 = Recv-Message $evalId 3000

    # Check 4: Check every ancestor wrapper for overflow / height
    $check4 = @'
    (() => {
        const firstSection = document.querySelector('#cinematic') || document.querySelector('section');
        if (!firstSection) return { error: 'No section found' };

        const ancestors = [];
        let curr = firstSection.parentElement;
        while (curr) {
            const cs = window.getComputedStyle(curr);
            ancestors.push({
                tagName: curr.tagName,
                id: curr.id || null,
                className: curr.className || null,
                overflow: cs.overflow,
                overflowX: cs.overflowX,
                overflowY: cs.overflowY,
                position: cs.position,
                height: cs.height,
                maxHeight: cs.maxHeight,
                display: cs.display
            });
            curr = curr.parentElement;
        }
        return ancestors;
    })()
'@
    $evalId = Send-Cmd "Runtime.evaluate" @{ expression = $check4; returnByValue = $true }
    $res4 = Recv-Message $evalId 3000

    # Check 6: Console errors
    $check6 = @'
    window.__errors || []
'@
    $evalId = Send-Cmd "Runtime.evaluate" @{ expression = $check6; returnByValue = $true }
    $res6 = Recv-Message $evalId 3000

    Write-Host "=== CHECK 1: WHAT RENDERS ==="
    $res1.result.result.value | ConvertTo-Json -Depth 5 | Write-Host

    Write-Host "`n=== CHECK 2: SECTIONS IN DOM ==="
    $res2.result.result.value | ConvertTo-Json -Depth 5 | Write-Host

    Write-Host "`n=== CHECK 3: COMPUTED CSS OF SECTIONS ==="
    $res3.result.result.value | ConvertTo-Json -Depth 5 | Write-Host

    Write-Host "`n=== CHECK 4: ANCESTORS AND OVERFLOW ==="
    $res4.result.result.value | ConvertTo-Json -Depth 5 | Write-Host

    Write-Host "`n=== CHECK 6: CONSOLE LOGS / ERRORS ==="
    Write-Host "Captured CDP console entries:" $consoleLogs.Count
    foreach ($log in $consoleLogs) {
        Write-Host $log
    }

} finally {
    try { $ws.Dispose() } catch {}
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
