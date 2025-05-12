import { useEffect, useState } from 'react';

function DataTable({ data, headers, totalRows, columnTypes }) {
    const [page, setPage] = useState(0);
    const rowsPerPage = 5;
    useEffect(() => {
        setPage(0);
    }, [data]);

    const startRow = page * rowsPerPage;
    const endRow = Math.min(startRow + rowsPerPage, data.length);
    const displayData = data.slice(startRow, endRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    const handlePrevPage = () => {
        setPage(prev => Math.max(0, prev - 1));
    };

    const handleNextPage = () => {
        setPage(prev => Math.min(totalPages - 1, prev + 1));
    };

    return (
        <div className="bg-muted border rounded-lg overflow-hidden">
            <div className="text-sm text-center font-medium text-foreground px-4 py-2 bg-muted border-b">
                Data Preview - {totalRows} Rows (total)
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-primary/20">
                    <thead className="bg-muted">
                        <tr>
                            {headers.map(header => (
                                <th
                                    key={header}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-muted divide-y divide-primary/20">
                        {
                            displayData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-primary/10">
                                    {
                                        headers.map((header, index) => {
                                            const columnType = columnTypes.find(c => c.name === header)?.type;
                                            let cellValue = row[index];

                                            if (columnType === 'date' && typeof cellValue === 'string') {
                                                const date = new Date(cellValue);
                                                if (!isNaN(date.getTime())) {
                                                    cellValue = date.toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    });
                                                }
                                            }
                                            return (
                                                <td
                                                    key={`${rowIndex}-${header}`}
                                                    className="px-6 py-4 whitespace-nowrap text-xs text-primary"
                                                >
                                                    {cellValue?.toString() || ''}
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            ))
                        }
                        {/* Empty state if no data */}
                        {
                            displayData.length === 0 && (
                                <tr>
                                    <td colSpan={headers.length} className="px-6 py-4 text-center text-sm text-primary">
                                        No data available
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-muted px-4 py-3 flex items-center justify-between border-t">
                    <div className="flex-1 flex justify-between items-center">
                        <button
                            onClick={handlePrevPage}
                            disabled={page === 0}
                            className={
                                `relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md
                                ${page === 0 ? 'bg-primary/50 text-primary-foreground/70 cursor-not-allowed'
                                    : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground/90 cursor-pointer'}`}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-secondary-foreground">
                            Page {page + 1} of {totalPages}
                        </span>

                        <button
                            onClick={handleNextPage}
                            disabled={page >= totalPages - 1}
                            className={
                                `relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md
                                  ${page >= totalPages - 1 ? 'bg-primary/50 text-primary-foreground/70 cursor-not-allowed'
                                    : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground/90 cursor-pointer'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataTable;