import xlsx from 'xlsx';

const determineColumnType = (values) => {
    let typeCounts = { numeric: 0, string: 0, boolean: 0, date: 0 };

    for (const value of values) {
        if (value === null || value === undefined) continue;
        if (typeof value === 'number') {
            typeCounts.numeric++;
        } else if (typeof value === 'boolean') {
            typeCounts.boolean++;
        } else if (Date.parse(value) && !isNaN(Date.parse(value))) {
            typeCounts.date++;
        } else {
            typeCounts.string++;
        }

        if (typeCounts.numeric > 0 && typeCounts.boolean === 0 && typeCounts.date === 0 && typeCounts.string === 0) return 'numeric';
        if (typeCounts.boolean > 0 && typeCounts.numeric === 0 && typeCounts.date === 0 && typeCounts.string === 0) return 'boolean';
        if (typeCounts.date > 0 && typeCounts.numeric === 0 && typeCounts.boolean === 0 && typeCounts.string === 0) return 'date';
    }

    return typeCounts.numeric > typeCounts.string ? 'numeric' : 'string';
};


const parseExcelFile = (filePath) => {
    try {
        const workbook = xlsx.readFile(filePath, { cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1, raw: false });

        if (!jsonData || jsonData.length === 0) {
            throw new Error('Excel file is empty');
        }

        const headers = jsonData[0];
        const rows = jsonData.slice(1);
        const sheetNames = workbook.SheetNames;

        const columnTypes = headers.map((header, index) => {
            const values = rows.map(row => row[index]).filter(val => val !== undefined);
            return {
                name: header,
                type: determineColumnType(values)
            };
        });

        return {
            sheetNames,
            currentSheet: firstSheetName,
            headers,
            rows,
            columnTypes,
            totalRows: rows.length
        };
    } catch (error) {
        throw new Error(`Failed to parse Excel file: ${error.message}`);
    }
};

export default parseExcelFile;
