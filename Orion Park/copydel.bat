@ECHO OFF
powershell -window minimized -command ""

for /F "delims=" %%I in ('dir "\\192.168.1.14\PSP_Orionpark\Workshop Stock & Delivery Records\*.xlsx" /A-D-H /B /O-D /TW 2^>nul') do copy /B /Y "\\192.168.1.14\PSP_Orionpark\Workshop Stock & Delivery Records\%%I" "C:\xampp\htdocs\dashboard\Orion Park\op.xlsx" >nul & goto FileCopied


:FileCopied
rem More commands after copying file with newest last modification date.
for /F "delims=" %%I in ('dir "\\192.168.1.14\PSP_Orionpark\Asset Register\*.xlsx" /A-D-H /B /O-D /TW 2^>nul') do copy /B /Y "\\192.168.1.14\PSP_Orionpark\Asset Register\%%I" "C:\xampp\htdocs\dashboard\Orion Park\assets.xlsx" >nul & goto FileCopied2

:FileCopied2
rem More commands after copying file with newest last modification date.

.\ExcelConverter.js

powershell -Command "& {(Get-Item 'C:\xampp\htdocs\dashboard\Orion Park\op.xlsx').LastWriteTime > temp.txt;}"
ping 192.0.2.2 -n 1 -w 1000 > nul
powershell -Command "& {Get-Content temp.txt | out-file -encoding UTF8 mod.txt;}"
ping 192.0.2.2 -n 1 -w 2000 > nul
del temp.txt
del op.xlsx
del assets.xlsx
del "assets-Asset Disposals.csv"
