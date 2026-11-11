$port = 8080
$folder = if (Test-Path "$PSScriptRoot\..\index.html") {
    (Resolve-Path "$PSScriptRoot\..").Path
} elseif (Test-Path "$PSScriptRoot\index.html") {
    $PSScriptRoot
} else {
    $pwd.Path
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
$listener.Start()
Write-Host "TCP HTTP Server running on http://localhost:$port (serving: $folder)"

while ($true) {
    try {
        $client = $listener.AcceptTcpClient()
        $client.ReceiveTimeout = 4000
        $client.SendTimeout = 10000
        $stream = $client.GetStream()
        $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::UTF8)
        $line = $reader.ReadLine()
        if ([string]::IsNullOrEmpty($line)) {
            $client.Close()
            continue
        }
        $parts = $line.Split(" ")
        $method = $parts[0]
        $rawPath = if ($parts.Length -gt 1) { $parts[1] } else { "/" }
        $pathWithoutQuery = $rawPath.Split("?")[0].TrimStart('/')
        if ([string]::IsNullOrEmpty($pathWithoutQuery)) { $pathWithoutQuery = "index.html" }
        $filePath = Join-Path $folder $pathWithoutQuery
        if (-not (Test-Path $filePath -PathType Leaf)) {
            if (Test-Path "$filePath.html" -PathType Leaf) {
                $filePath = "$filePath.html"
            } elseif (Test-Path (Join-Path $folder "pages\$pathWithoutQuery") -PathType Leaf) {
                $filePath = Join-Path $folder "pages\$pathWithoutQuery"
            } elseif (Test-Path (Join-Path $folder "pages\$pathWithoutQuery.html") -PathType Leaf) {
                $filePath = Join-Path $folder "pages\$pathWithoutQuery.html"
            }
        }

        # Parse request headers
        $rangeHeader = $null
        while ($true) {
            $h = $reader.ReadLine()
            if ([string]::IsNullOrEmpty($h)) { break }
            if ($h -match "^Range:\s*bytes=(\d*)-(\d*)") {
                $rangeHeader = $matches
            }
        }

        if (Test-Path $filePath -PathType Leaf) {
            $fileInfo = [System.IO.FileInfo]::new($filePath)
            $totalBytes = $fileInfo.Length
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".txt"  { "text/plain; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                ".mp4"  { "video/mp4" }
                ".webp" { "image/webp" }
                ".woff2" { "font/woff2" }
                ".woff" { "font/woff" }
                default { "application/octet-stream" }
            }
            $cacheControl = if ($ext -eq ".html" -or $ext -eq ".css" -or $ext -eq ".js" -or [string]::IsNullOrEmpty($ext)) {
                "no-cache, no-store, must-revalidate"
            } else {
                "public, max-age=31536000, immutable"
            }

            if ($null -ne $rangeHeader -and $totalBytes -gt 0) {
                # Handle 206 Partial Content (critical for iOS Safari and mobile video players)
                $startStr = $rangeHeader[1]
                $endStr = $rangeHeader[2]
                $start = if ([string]::IsNullOrEmpty($startStr)) { 0L } else { [int64]$startStr }
                $end = if ([string]::IsNullOrEmpty($endStr)) { $totalBytes - 1L } else { [int64]$endStr }
                if ($end -ge $totalBytes) { $end = $totalBytes - 1L }
                if ($start -gt $end) { $start = 0L }
                $contentLength = $end - $start + 1L

                $header = "HTTP/1.1 206 Partial Content`r`nContent-Type: $contentType`r`nContent-Range: bytes $start-$end/$totalBytes`r`nContent-Length: $contentLength`r`nAccept-Ranges: bytes`r`nCache-Control: $cacheControl`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
                $stream.Write($headerBytes, 0, $headerBytes.Length)

                if ($method -ne "HEAD") {
                    $fs = [System.IO.FileStream]::new($filePath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
                    try {
                        [void]$fs.Seek($start, [System.IO.SeekOrigin]::Begin)
                        $buffer = [byte[]]::new(65536)
                        $remaining = $contentLength
                        while ($remaining -gt 0) {
                            $toRead = [Math]::Min($buffer.Length, $remaining)
                            $read = $fs.Read($buffer, 0, $toRead)
                            if ($read -le 0) { break }
                            $stream.Write($buffer, 0, $read)
                            $remaining -= $read
                        }
                    } finally {
                        $fs.Close()
                    }
                }
            } else {
                # Handle 200 OK
                $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $totalBytes`r`nAccept-Ranges: bytes`r`nCache-Control: $cacheControl`r`nAccess-Control-Allow-Origin: *`r`nX-Robots-Tag: all`r`nConnection: close`r`n`r`n"
                $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
                $stream.Write($headerBytes, 0, $headerBytes.Length)

                if ($method -ne "HEAD") {
                    $fs = [System.IO.FileStream]::new($filePath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
                    try {
                        $buffer = [byte[]]::new(65536)
                        $remaining = $totalBytes
                        while ($remaining -gt 0) {
                            $toRead = [Math]::Min($buffer.Length, $remaining)
                            $read = $fs.Read($buffer, 0, $toRead)
                            if ($read -le 0) { break }
                            $stream.Write($buffer, 0, $read)
                            $remaining -= $read
                        }
                    } finally {
                        $fs.Close()
                    }
                }
            }
        } else {
            $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($body, 0, $body.Length)
        }
        $stream.Flush()
        $client.Close()
    } catch {
        # ignore socket disconnect / loop
    }
}
