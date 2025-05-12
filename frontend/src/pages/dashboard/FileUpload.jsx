import { useEffect, useState } from 'react';
import { uploadExcel } from '@/api';
import { ChartBuilder, DataTable } from '@/components';
import { handleExcelFile, showGenericErrorAsToast } from '@/utils';
import { useImmer } from 'use-immer';

function FileUpload() {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const [data, setData] = useImmer({
    headers: [],
    columnTypes: [],
    sheetNames: [],
    data: [],
    totalRows: 0,
    allSheets: []
  });
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    setError('');
    setData({
      headers: [],
      columnTypes: [],
      sheetNames: [],
      data: [],
      totalRows: 0,
      allSheets: []
    });
    try {
      const file = await handleExcelFile(e);
      if (!file) return;
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('excelFile', file);
        const { success, data, fieldErrors, genericErrors } = await uploadExcel(formData);

        if (success && data.sheets && data.sheets.length > 0) {
          const sheetNames = data.sheets.map(sheet => sheet.sheetName);
          setData({
            headers: data.sheets[0].headers,
            columnTypes: data.sheets[0].columnTypes,
            sheetNames: sheetNames,
            data: data.sheets[0].data || [],
            totalRows: data.sheets[0].totalRows,
            allSheets: data.sheets
          });
          setSelectedSheetIndex(0);
          return;
        }

        if (fieldErrors && fieldErrors.excelFile) {
          setError(fieldErrors.excelFile);
          setData({
            headers: [],
            columnTypes: [],
            sheetNames: [],
            data: [],
            totalRows: 0,
            allSheets: []
          });
        }

        showGenericErrorAsToast(genericErrors);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      setError(error.message || error);
      setData({
        headers: [],
        columnTypes: [],
        sheetNames: [],
        data: [],
        totalRows: 0,
        allSheets: []
      });
    }
  };

  const handleSheetChange = (index) => {
    const sheetIndex = parseInt(index);

    if (data.allSheets && data.allSheets[sheetIndex]) {
      const selectedSheet = data.allSheets[sheetIndex];
      setData(draft => {
        draft.headers = selectedSheet.headers;
        draft.columnTypes = selectedSheet.columnTypes;
        draft.data = selectedSheet.data || [];
        draft.totalRows = selectedSheet.totalRows;
      });
      setSelectedSheetIndex(sheetIndex);
    }
  };



  return (
    <div>
      <h2 className='text-xl font-semibold text-muted-foreground mb-4'>Upload & Analyze Data</h2>

      <div className="p-6 pt-6 w-full bg-fileupload-bg rounded-md shadow-md flex flex-col gap-6">
        {/* File Upload Section */}
        <div>
          <label
            htmlFor="file-upload"
            className="block text-xl font-semibold text-foreground mb-2"
          >Upload Excel File</label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
            className="mt-1 block w-full text-sm text-muted-foreground
            file:mr-4 file:py-2 file:px-4
            file:rounded-sm file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-primary-foreground
            hover:file:bg-primary/90 hover:file:text-primary-foreground/90
            file:cursor-pointer"
            accept=".xlsx, .xls"
          />
          {
            isLoading && (
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                <span className="ml-2 text-muted-foreground">Processing file...</span>
              </div>
            )
          }
          {
            error && (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            )
          }
        </div>


        {!error && data && data.headers && data.headers.length > 0 && (
          <>
            <div className='w-full h-[2px] my-2 bg-secondary'></div>
            <div>
              <ChartBuilder
                sheetNames={data.sheetNames}
                headers={data.headers}
                columnTypes={data.columnTypes}
                initialData={data.data}
                isDarkMode={isDarkMode}
                handleSheetChange={handleSheetChange}
                selectedSheetIndex={selectedSheetIndex}
              />
            </div>

            <div className='w-full h-[2px] my-2 bg-secondary'></div>

            <div>
              <h2 className="text-xl font-semibold mb-3 text-foreground">Data Preview</h2>
              <DataTable
                headers={data.headers}
                data={data.data || []}
                totalRows={data.totalRows || 0}
                columnTypes={data.columnTypes}
              />
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default FileUpload;