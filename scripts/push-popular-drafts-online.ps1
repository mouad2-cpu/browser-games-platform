# Push draft popular games to the ONLINE site (zenfungames.com)
# 1) Copies covers into public/uploads/thumbnails
# 2) Commits seed/admin files + thumbnails
# 3) Pushes to origin/main (triggers your host deploy if connected)
# 4) After deploy: open https://www.zenfungames.com/admin/seed-popular and click the button
#    OR set DATABASE_URL to production and run: npm run db:seed-popular-drafts

$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

$assets = Join-Path $env:USERPROFILE ".cursor\projects\c-Users-mohamed-browser-games-platform\assets"
$thumbs = "public\uploads\thumbnails"
New-Item -ItemType Directory -Force -Path $thumbs | Out-Null

$map = @{
  "cover-slope-run.png" = "slope-run.png"
  "cover-crazy-tunnel.png" = "crazy-tunnel.png"
  "cover-geometry-dash.png" = "geometry-dash.png"
  "cover-helix-jump.png" = "helix-jump.png"
  "cover-stickman-hook.png" = "stickman-hook.png"
  "cover-rail-runner.png" = "rail-runner.png"
  "cover-moto-x3m.png" = "moto-x3m.png"
  "cover-drift-boss.png" = "drift-boss.png"
  "cover-basketball-stars.png" = "basketball-stars-2026.png"
  "cover-football-legends.png" = "football-legends.png"
  "cover-fireboy-watergirl.png" = "fireboy-and-watergirl.png"
  "cover-2048.png" = "2048.png"
}

foreach ($srcName in $map.Keys) {
  $from = Join-Path $assets $srcName
  $to = Join-Path $thumbs $map[$srcName]
  if (Test-Path $from) {
    Copy-Item $from $to -Force
    Write-Host "Copied $($map[$srcName])"
  } else {
    Write-Warning "Missing cover: $from"
  }
}

git add `
  prisma/seed-popular-drafts.ts `
  scripts/seed-popular-drafts.bat `
  scripts/push-popular-drafts-online.ps1 `
  src/app/admin/seed-popular `
  src/app/api/admin/seed-popular-drafts `
  package.json `
  public/uploads/thumbnails/*.png

git status --short

$msg = @"
Add popular games as unpublished drafts with SEO fields.

Includes covers, embeds, meta titles/descriptions, and admin seed helper. Games stay draft until published.
"@

git commit -m $msg
if ($LASTEXITCODE -ne 0) {
  Write-Host "Nothing to commit or commit failed. Continuing to push if needed..."
}

git push -u origin HEAD
if ($LASTEXITCODE -ne 0) {
  Write-Error "git push failed. Check GitHub auth, then retry."
  exit 1
}

Write-Host ""
Write-Host "Code pushed to GitHub."
Write-Host "After production deploy finishes:"
Write-Host "  1) Log into https://www.zenfungames.com/admin"
Write-Host "  2) Open https://www.zenfungames.com/admin/seed-popular"
Write-Host "  3) Click 'Add games as draft'"
Write-Host ""
Write-Host "OR seed production DB directly:"
Write-Host '  $env:DATABASE_URL="mysql://USER:PASS@PROD_HOST:3306/DB"; npm run db:seed-popular-drafts'
