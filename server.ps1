# ==============================================================================
# Weight Overview Pro - Lokaler Synchronisations-Server für Dropbox
# Startet einen ressourcenschonenden HTTP-Server auf Port 8080 (oder nächstem freien Port)
# und sichert alle Änderungen automatisch direkt in 'data.js' auf der Festplatte.
# ==============================================================================

$port = 8080
$rootDir = $PSScriptRoot
if (-not $rootDir) { $rootDir = (Get-Location).Path }

# MIME Type Mapping
$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

# Freien Port suchen
$listener = $null
while ($port -lt 8100) {
    try {
        $listener = New-Object System.Net.HttpListener
        $prefix = "http://127.0.0.1:$port/"
        $listener.Prefixes.Add($prefix)
        $listener.Start()
        break
    } catch {
        if ($listener) { $listener.Close() }
        $port++
    }
}

if (-not $listener -or -not $listener.IsListening) {
    Write-Error "Fehler: Lokaler Server konnte nicht gestartet werden."
    Exit 1
}

$url = "http://127.0.0.1:$port/index.html"
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Weight Overview Pro - Dropbox Sync Server AKTIV" -ForegroundColor Green
Write-Host "  Adresse: $url" -ForegroundColor Yellow
Write-Host "  Ordner:  $rootDir" -ForegroundColor Gray
Write-Host "  Automatisches Speichern in 'data.js' laeuft im Hintergrund." -ForegroundColor Green
Write-Host "  Druecke Strg+C zum Beenden." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# Standard-Browser automatisch öffnen
Start-Process $url

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # CORS & Cache-Control Header
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
        $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
        $response.Headers.Add("Pragma", "no-cache")
        $response.Headers.Add("Expires", "0")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        $rawPath = $request.Url.LocalPath
        if ($rawPath -eq "/" -or $rawPath -eq "") { $rawPath = "/index.html" }

        # API Save Endpoint: Schreibt die data.js direkt auf Festplatte
        if ($rawPath -eq "/api/save" -and $request.HttpMethod -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $reader.Close()

            try {
                $payload = $body | ConvertFrom-Json
                $dataJsPath = Join-Path $rootDir "data.js"
                
                # Datei sauber mit UTF-8 schreiben
                [System.IO.File]::WriteAllText($dataJsPath, $payload.content, [System.Text.Encoding]::UTF8)
                
                $msg = '{"status":"ok","message":"data.js gespeichert"}'
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($msg)
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
                $response.StatusCode = 200
                $now = Get-Date -Format "HH:mm:ss"
                Write-Host "[$now] ✓ data.js erfolgreich aktualisiert -> Dropbox synchronisiert jetzt!" -ForegroundColor Green
            } catch {
                $errMsg = '{"status":"error","message":"' + $_.Exception.Message + '"}'
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($errMsg)
                $response.ContentType = "application/json; charset=utf-8"
                $response.StatusCode = 500
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
                Write-Host "Fehler beim Speichern: $($_.Exception.Message)" -ForegroundColor Red
            }
            $response.Close()
            continue
        }

        # API Status Endpoint
        if ($rawPath -eq "/api/status") {
            $msg = '{"status":"connected","server":"WeightSyncServer","port":' + $port + '}'
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($msg)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        # Statische Dateien ausliefern
        $cleanRel = $rawPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $filePath = Join-Path $rootDir $cleanRel

        if ([System.IO.File]::Exists($filePath)) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $ct = "application/octet-stream"
            if ($mimeTypes.ContainsKey($ext)) { $ct = $mimeTypes[$ext] }
            
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $ct
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }
        $response.Close()
    }
} finally {
    if ($listener) {
        $listener.Stop()
        $listener.Close()
    }
}
