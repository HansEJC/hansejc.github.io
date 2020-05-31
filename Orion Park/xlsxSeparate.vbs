if WScript.Arguments.Count < 1 Then
    WScript.Echo "Please specify the source file. Usage: ExcelToCsv <xls/xlsx source file> <csv destination file>"
    Wscript.Quit
End If

Set objFSO = CreateObject("Scripting.FileSystemObject")

src_file = objFSO.GetAbsolutePathName(Wscript.Arguments.Item(0))

Dim oExcel
Set oExcel = CreateObject("Excel.Application")

Dim wbThis
Set wbThis = oExcel.Workbooks.Open(src_file)

Dim wbNew 
Set wbNew = oExcel.Workbook
Dim ws 
Set ws = oExcel.Worksheet
Dim strFilename
Set strFilename = String
    
    For Each ws In wbThis.Worksheets
        strFilename = wbThis.Path & "/" & ws.Name
        ws.Copy
        Set wbNew = ActiveWorkbook
        wbNew.SaveAs strFilename
        wbNew.Close
    Next

wbThis.Close False
oExcel.Quit