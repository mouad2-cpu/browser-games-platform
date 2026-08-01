@echo off
cd /d "%~dp0\.."
echo Copying covers into public\uploads\thumbnails ...
if not exist "public\uploads\thumbnails" mkdir "public\uploads\thumbnails"
set ASSETS=%USERPROFILE%\.cursor\projects\c-Users-mohamed-browser-games-platform\assets
copy /Y "%ASSETS%\cover-slope-run.png" "public\uploads\thumbnails\slope-run.png" >nul
copy /Y "%ASSETS%\cover-crazy-tunnel.png" "public\uploads\thumbnails\crazy-tunnel.png" >nul
copy /Y "%ASSETS%\cover-geometry-dash.png" "public\uploads\thumbnails\geometry-dash.png" >nul
copy /Y "%ASSETS%\cover-helix-jump.png" "public\uploads\thumbnails\helix-jump.png" >nul
copy /Y "%ASSETS%\cover-stickman-hook.png" "public\uploads\thumbnails\stickman-hook.png" >nul
copy /Y "%ASSETS%\cover-rail-runner.png" "public\uploads\thumbnails\rail-runner.png" >nul
copy /Y "%ASSETS%\cover-moto-x3m.png" "public\uploads\thumbnails\moto-x3m.png" >nul
copy /Y "%ASSETS%\cover-drift-boss.png" "public\uploads\thumbnails\drift-boss.png" >nul
copy /Y "%ASSETS%\cover-basketball-stars.png" "public\uploads\thumbnails\basketball-stars-2026.png" >nul
copy /Y "%ASSETS%\cover-football-legends.png" "public\uploads\thumbnails\football-legends.png" >nul
copy /Y "%ASSETS%\cover-fireboy-watergirl.png" "public\uploads\thumbnails\fireboy-and-watergirl.png" >nul
copy /Y "%ASSETS%\cover-2048.png" "public\uploads\thumbnails\2048.png" >nul
echo Seeding draft games (not published)...
call npx tsx prisma\seed-popular-drafts.ts
echo.
pause
