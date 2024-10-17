@echo off
title Backdoored v1.0 - RELEASE
node backdoored.js

echo ----------------------------------
echo Woah! Looks like an error occured!
echo Press any key to try to fix.

pause > nul

:: if the file doesn't start it'll try to install discord.js

cls
echo Trying to fix...
echo If the problem persists, contact notloann on discord.
npm i discord.js@latest
pause > nul