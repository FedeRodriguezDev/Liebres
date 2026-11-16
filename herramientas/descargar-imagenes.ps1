# Descarga las imágenes (y los 3 videos) que usa el sitio, desde Wix, en dos tamaños optimizados para web:
#   img/sitio/g/  -> 1600 px (imágenes grandes, galerías ampliadas, planos y planchetas)
#   img/sitio/m/  ->  900 px (miniaturas y tarjetas)
# Uso: abrir una terminal en la carpeta del repo y ejecutar:
#   powershell -ExecutionPolicy Bypass -File herramientas\descargar-imagenes.ps1
# Se puede volver a correr: saltea lo que ya está descargado.
$ErrorActionPreference = "Continue"
$repo = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$lista = Join-Path $repo "herramientas\imagenes-sitio.txt"
$fallos = @()
$n = 0
$filas = Get-Content $lista | Where-Object { $_ }
foreach ($fila in $filas) {
  $n++
  $url, $rel = $fila -split "\|"
  $destino = Join-Path $repo $rel
  $carpeta = Split-Path -Parent $destino
  if (-not (Test-Path $carpeta)) { New-Item -ItemType Directory -Force -Path $carpeta | Out-Null }
  if (Test-Path $destino) { continue }
  try {
    Invoke-WebRequest -Uri $url -OutFile $destino -UseBasicParsing -Headers @{ "Accept" = "image/jpeg,image/png,*/*" }
    Write-Host ("[{0}/{1}] OK  {2}" -f $n, $filas.Count, $rel)
  } catch {
    $fallos += $rel
    Write-Host ("[{0}/{1}] ERROR  {2}" -f $n, $filas.Count, $rel) -ForegroundColor Red
  }
}
Write-Host ""
$total = (Get-ChildItem (Join-Path $repo "img\sitio") -Recurse -File | Measure-Object -Property Length -Sum)
Write-Host ("Listo. Imágenes: {0}  Tamaño: {1:N0} MB  Fallaron: {2}" -f $total.Count, ($total.Sum / 1MB), $fallos.Count)
Get-ChildItem (Join-Path $repo "video") -Filter "*-720.mp4" | ForEach-Object { Write-Host ("Video {0}: {1:N1} MB" -f $_.Name, ($_.Length / 1MB)) }
if ($fallos.Count) { $fallos | ForEach-Object { Write-Host "  $_" -ForegroundColor Red } }
