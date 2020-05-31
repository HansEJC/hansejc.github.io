@ECHO OFF
powershell -window minimized -command ""

for /F "delims=" %%I in ('dir "\\192.168.1.14\PSP_Orionpark\Workshop Stock & Delivery Records\*.xlsx" /A-D-H /B /O-D /TW 2^>nul') do copy /B /Y "\\192.168.1.14\PSP_Orionpark\Workshop Stock & Delivery Records\%%I" "C:\xampp\htdocs\dashboard\Orion Park\op.xlsx" >nul & goto FileCopied

:FileCopied
rem More commands after copying file with newest last modification date.

::copy "\\192.168.1.14\PSP_Orionpark\Workshop Stock & Delivery Records\Y01-AA-FOR-0098 A01 Workshop Stock Record and Y01-AA-FOR-0099-Workshop Delivery Record - UPDATED1.xlsx" op.xlsx

::.\XlsToCsv.vbs delivery.xlsx delivery.csv
.\ExcelConverter.js
::PAUSE

