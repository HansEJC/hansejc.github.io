@ECHO OFF
::powershell -window minimized -command ""


echo open hansejc.ddns.net> temp.txt
echo user user butterfly>> temp.txt
echo cd FTP/OP>> temp.txt
echo binary>> temp.txt
echo put "C:\xampp\htdocs\dashboard\Orion Park\op.xlsx">> temp.txt
echo put "C:\xampp\htdocs\dashboard\Orion Park\op-Delivery.csv">> temp.txt
echo put "C:\xampp\htdocs\dashboard\Orion Park\op-Project Stock.csv">> temp.txt
echo put "C:\xampp\htdocs\dashboard\Orion Park\op-Warehouse Stock .csv">> temp.txt
echo quit>> temp.txt

powershell ftp -n -s:temp.txt 

del "C:\xampp\htdocs\dashboard\Orion Park\temp.txt"