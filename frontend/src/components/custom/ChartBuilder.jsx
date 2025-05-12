import { downloadFile, getCssVarAsHex, suggestChartType, TOAST_OPTIONS } from '@/utils';
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { AxisSelector, ChartOptions, ErrorBoundary } from '.';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';


const CHART_OPTIONS = [
    { label: 'Scatter Plot', value: 'scatter' },
    { label: 'Bar Chart', value: 'bar' },
    { label: 'Line Chart', value: 'line' },
    { label: 'Pie Chart', value: 'pie' },
    { label: '3D Scatter', value: 'scatter3d' },
];

const DOWNLOAD_OPTIONS = [
    { label: 'SVG - Vector Graphics (Best for print)', value: 'svg' },
    { label: 'PNG - Image Format (Good for web)', value: 'png' },
    { label: 'JPEG - Compressed Image', value: 'jpeg' },
    { label: 'WebP - Modern Image Format', value: 'webp' },
    { label: 'PDF - Document Format', value: 'pdf' }
];

const getFormatTooltip = (format) => {
    switch (format) {
        case 'svg': return 'Vector format, best for print & scaling';
        case 'png': return 'Lossless raster format, good for web';
        case 'jpeg': return 'Compressed format, smaller file size';
        case 'webp': return 'Modern compressed format, good for web';
        case 'pdf': return 'Document format, good for reports & print';
        default: return '';
    }
};

const getColorForScheme = (scheme, isDarkMode) => {
    switch (scheme) {
        case 'viridis': return '#440154';
        case 'plasma': return '#9c179e';
        case 'warm': return '#d13b40';
        case 'cool': return '#3b518a';
        default: return isDarkMode ? '#63B3ED' : '#3182CE';
    }
};


function ChartBuilder({
    headers,
    columnTypes,
    sheetNames,
    initialData,
    isDarkMode = false,
    handleSheetChange = () => { },
    selectedSheetIndex = 0
}) {
    const chartOptionsForSelect = [
        { label: 'Scatter Plot', value: 'scatter' },
        { label: 'Bar Chart', value: 'bar' },
        { label: 'Line Chart', value: 'line' },
        { label: 'Pie Chart', value: 'pie' },
        { label: '3D Scatter', value: 'scatter3d' },
    ];// remove

    const [selectedSheet, setSelectedSheet] = useState(sheetNames[0] || '');
    const [chartType, setChartType] = useState('scatter');
    const [xAxis, setXAxis] = useState(headers[0] || '');
    const [yAxis, setYAxis] = useState(headers.length > 1 ? headers[1] : headers[0] || '');
    const [zAxis, setZAxis] = useState(null);
    const [chartOptions, setChartOptions] = useState({
        colorScheme: 'default',
        markerSize: initialData.length > 1000 ? 4 : 8,
        showLegend: true
    });
    const [downloadFormat, setDownloadFormat] = useState('svg');
    const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);

    const plotRef = useRef(null);
    const downloadMenuRef = useRef(null);

    const downloadOptions = [
        { label: 'SVG - Vector Graphics (Best for print)', value: 'svg' },
        { label: 'PNG - Image Format (Good for web)', value: 'png' },
        { label: 'JPEG - Compressed Image', value: 'jpeg' },
        { label: 'WebP - Modern Image Format', value: 'webp' },
        { label: 'PDF - Document Format', value: 'pdf' }
    ];// remove

    // Close download menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target)) {
                setIsDownloadMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Chart type suggestion based on data
    useEffect(() => {
        if (headers.length > 1 && columnTypes.length > 0) {
            const suggestion = suggestChartType(columnTypes, headers);
            setChartType(suggestion.chartType);
            setXAxis(suggestion.xAxis);
            setYAxis(suggestion.yAxis);
        }
    }, [headers, columnTypes])

    // Adjust download format based on chart type
    useEffect(() => {
        if (chartType === 'scatter' || chartType === 'line' || chartType.includes('3d')) {
            setDownloadFormat('svg');
        } else if (chartType === 'pie') {
            setDownloadFormat('png');
        }
    }, [chartType]);

    // To check if a column is numeric
    const isNumeric = useCallback((header) => {
        return columnTypes.find(c => c.name === header)?.type === 'numeric';
    }, [columnTypes]);

    // To change chart option
    const handleOptionsChange = useCallback((newOptions) => {
        setChartOptions(prev => ({ ...prev, ...newOptions }));
    }, []);

    const handleSheetSelection = useCallback((e) => {
        const value = e.target.value;
        setSelectedSheet(value);
        handleSheetChange(value);
    }, [handleSheetChange]);

    const handleFormatSelect = useCallback((format) => {
        setDownloadFormat(format);
        setIsDownloadMenuOpen(false);
    }, []);

    // Process data
    const processedData = useMemo(() => {
        return initialData.map(row => {
            const processedRow = {};
            columnTypes.forEach(({ name, type }, index) => {
                const rawValue = row[index];

                if (rawValue === undefined || rawValue === null) {
                    processedRow[name] = null;
                    return;
                }

                switch (type) {
                    case 'numeric':
                        processedRow[name] = rawValue === '' ? null :
                            !isNaN(parseFloat(rawValue)) ? parseFloat(rawValue) : rawValue;
                        break;

                    case 'boolean':
                        if (typeof rawValue === 'boolean') {
                            processedRow[name] = rawValue;
                        }
                        else if (typeof rawValue === 'string') {
                            const lowerValue = rawValue.toLowerCase();
                            if (['true', 'yes', '1', 'y'].includes(lowerValue)) {
                                processedRow[name] = true;
                            }
                            else if (['false', 'no', '0', 'n'].includes(lowerValue)) {
                                processedRow[name] = false;
                            }
                            else {
                                processedRow[name] = null;
                            }
                        }
                        else if (typeof rawValue === 'number') {
                            processedRow[name] = rawValue !== 0;
                        }
                        else {
                            processedRow[name] = null;
                        }
                        break;

                    case 'date':
                        try {
                            if (rawValue instanceof Date) {
                                processedRow[name] = rawValue;
                            }
                            else if (typeof rawValue === 'string' && rawValue.trim() !== '') {
                                const parsedDate = new Date(rawValue);
                                processedRow[name] = !isNaN(parsedDate.getTime()) ? parsedDate : rawValue;
                            }
                            else {
                                processedRow[name] = rawValue;
                            }
                        }
                        catch (e) {
                            processedRow[name] = rawValue;
                        }
                        break;

                    case 'string':
                    default:
                        processedRow[name] = typeof rawValue === 'string' ?
                            rawValue :
                            rawValue !== null && rawValue !== undefined ? String(rawValue) : rawValue;
                        break;
                }
            });
            return processedRow;
        });
    }, [initialData, columnTypes]);

    // Create chart trace configuration
    const chartTrace = useMemo(() => {
        if (!processedData.length || !xAxis || !yAxis) {
            return {};
        }

        const markerSize = chartOptions.markerSize || (initialData.length > 1000 ? 3 : 8);
        const color = getColorForScheme(chartOptions.colorScheme, isDarkMode);

        let mode = 'markers';
        if (chartType === 'line') {
            mode = 'lines+markers';
        }
        else if (chartType === 'bar') {
            mode = 'none';
        }

        const baseTrace = {
            x: processedData.map(row => row[xAxis]),
            y: processedData.map(row => row[yAxis]),
            type: chartType.includes('gl') ? chartType.replace('gl', '') : chartType,
            mode,
            marker: {
                size: markerSize,
                color
            }
        };

        if (initialData.length > 1000 && chartType === 'scatter') {
            baseTrace.type = 'scattergl';
        }

        if (chartType === 'pie') {
            return {
                labels: processedData.map(row => row[xAxis]),
                values: processedData.map(row => row[yAxis]),
                type: 'pie',
                marker: { colors: [color] }
            };
        }

        if (chartType.includes('3d')) {
            return {
                ...baseTrace,
                z: zAxis ? processedData.map(row => row[zAxis]) : Array(processedData.length).fill(0)
            };
        }

        return baseTrace;
    }, [xAxis, yAxis, zAxis, chartType, processedData, initialData.length, isDarkMode, chartOptions]);

    // Create chart layout configuration
    const layout = useMemo(() => {
        const baseLayout = {
            title: {
                text: `${xAxis}  v/s  ${yAxis}${zAxis ? ` vs ${zAxis}` : ''}`,
                font: {
                    size: 22,
                    color: getCssVarAsHex('--chart-title-color'),
                },
                pad: { t: 10 },
                xref: 'paper',
                x: 0.5
            },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { color: getCssVarAsHex('--chart-title-color') },
            xaxis: {
                title: {
                    text: xAxis,
                    font: {
                        size: 16,
                        color: getCssVarAsHex('--chart-title-color')
                    },
                    standoff: 20
                },
                gridcolor: getCssVarAsHex('--chart-grid-color'),
            },
            yaxis: {
                title: {
                    text: yAxis,
                    font: {
                        size: 16,
                        color: getCssVarAsHex('--chart-title-color')
                    },
                    standoff: 20
                },
                gridcolor: getCssVarAsHex('--chart-grid-color'),
            },
            margin: { l: 80, r: 80, b: 80, t: 80, pad: 4 },
            showlegend: chartOptions.showLegend
        };

        if (chartType.includes('3d')) {
            baseLayout.scene = {
                xaxis: {
                    title: {
                        text: xAxis,
                        font: {
                            size: 16,
                            color: getCssVarAsHex('--chart-title-color')
                        }
                    },
                    gridcolor: getCssVarAsHex('--chart-grid-color')
                },
                yaxis: {
                    title: {
                        text: yAxis,
                        font: {
                            size: 16,
                            color: getCssVarAsHex('--chart-title-color')
                        }
                    },
                    gridcolor: getCssVarAsHex('--chart-grid-color')
                },
                zaxis: {
                    title: {
                        text: zAxis || '',
                        font: {
                            size: 16,
                            color: getCssVarAsHex('--chart-title-color')
                        }
                    },
                    gridcolor: getCssVarAsHex('--chart-grid-color')
                }
            };
        }

        return baseLayout;
    }, [xAxis, yAxis, zAxis, chartType, isDarkMode, chartOptions.showLegend]);

    // Warning for non-numeric columns
    const showNumericWarning = (chartType !== 'pie' && !isNumeric(yAxis)) ||
        (chartType.includes('3d') && zAxis && !isNumeric(zAxis));

    // Enhanced download function
    const handleDownload = useCallback(() => {
        if (!plotRef.current?.el) {
            toast.error('Chart not available for download', TOAST_OPTIONS);
            return;
        }

        try {
            const plotElement = plotRef.current.el;
            const fileName = `chart-${chartType}-${xAxis}-${yAxis}`;
            const { clientWidth, clientHeight } = plotElement;
            const aspectRatio = clientWidth / clientHeight;

            // Prepare enhanced export layout with improved styling
            const exportLayout = {
                ...layout,
                font: { ...layout.font, color: '#000000' },
                title: {
                    ...layout.title,
                    font: { ...layout.title.font, color: '#000000', size: 24 }
                },
                xaxis: {
                    ...layout.xaxis,
                    title: { ...layout.xaxis.title, font: { ...layout.xaxis.title.font, color: '#000000', size: 18, } },
                    tickfont: { color: '#000000', size: 14 },
                    gridcolor: '#dddddd',
                    linewidth: 2,
                    linecolor: '#000000',
                },
                yaxis: {
                    ...layout.yaxis,
                    title: { ...layout.yaxis.title, font: { ...layout.yaxis.title.font, color: '#000000', size: 18 } },
                    tickfont: { color: '#000000', size: 14 },
                    gridcolor: '#dddddd',
                    linewidth: 2,
                    linecolor: '#000000',
                },
                paper_bgcolor: '#ffffff',
                plot_bgcolor: '#ffffff',
            };

            // Create enhanced export trace
            const exportData = JSON.parse(JSON.stringify([chartTrace]));
            exportData.forEach(trace => {
                if (trace.marker && !chartType.includes('pie')) {
                    trace.marker.size = trace.marker.size * 1.2;

                    if (trace.marker.color) {
                        if (typeof trace.marker.color === 'string') {
                            const color = trace.marker.color;
                            trace.marker.color = color === '#63B3ED' ?
                                '#2B6CB0' : color === '#3182CE' ?
                                    '#2B6CB0' : color;
                        }

                        trace.marker.line = { width: 1.5, color: 'rgba(0,0,0,0.8)' };
                    }
                }

                if (chartType === 'line' || trace.mode?.includes('lines')) {
                    trace.line = { ...trace.line, width: 3, shape: 'spline' };
                }

                if (chartType === 'pie') {
                    trace.textfont = { color: '#000000', size: 14 };
                    trace.outsidetextfont = { color: '#000000', size: 14, weight: 'bold' };
                }

                if (chartType.includes('3d') && trace.marker) {
                    trace.marker.size = trace.marker.size * 1.5;
                    trace.marker.opacity = 0.9;
                }
            });

            // Handle PDF export
            if (downloadFormat === 'pdf') {
                Plotly.toImage(plotElement, {
                    format: 'png',
                    width: clientWidth,
                    height: clientHeight,
                    scale: 4,
                    filename: fileName,
                    data: exportData,
                    layout: exportLayout
                }).then(pngDataUrl => {
                    const orientation = clientWidth > clientHeight ? 'landscape' : 'portrait';
                    const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' });

                    const pdfWidth = orientation === 'landscape' ? 297 : 210;
                    const pdfHeight = orientation === 'landscape' ? 210 : 297;
                    const margin = 10;
                    const maxImageWidth = pdfWidth - (margin * 2);
                    const maxImageHeight = pdfHeight - (margin * 2);

                    // Calculate image dimensions while preserving aspect ratio
                    let imageWidth, imageHeight;
                    if (maxImageWidth / aspectRatio <= maxImageHeight) {
                        imageWidth = maxImageWidth;
                        imageHeight = maxImageWidth / aspectRatio;
                    }
                    else {
                        imageHeight = maxImageHeight;
                        imageWidth = maxImageHeight * aspectRatio;
                    }

                    const x = (pdfWidth - imageWidth) / 2;
                    const y = (pdfHeight - imageHeight) / 2;

                    const img = new Image();
                    img.onload = function () {
                        pdf.addImage(pngDataUrl, 'PNG', x, y, imageWidth, imageHeight);
                        pdf.save(`${fileName}.pdf`);
                        setIsDownloadMenuOpen(false);
                    };
                    img.src = pngDataUrl;
                }).catch(err => {
                    console.error('Error generating PDF:', err);
                    toast.error('Failed to generate PDF. Please try another format.', TOAST_OPTIONS);
                });
                return;
            }

            // Handle other formats
            const supportedFormats = ['png', 'svg', 'jpeg', 'webp'];
            if (!supportedFormats.includes(downloadFormat)) {
                toast.error(`Sorry, ${downloadFormat.toUpperCase()} format is not supported. Please select another format.`, TOAST_OPTIONS);
                return;
            }

            // let scale = 1;
            // let width = clientWidth;
            // let height = clientHeight; //remove


            // Determine export parameters based on format
            let scale = 1, width = clientWidth, height = clientHeight;
            switch (downloadFormat) {
                case 'svg':
                    scale = 1;
                    width = Math.max(clientWidth, 1200);
                    height = width / aspectRatio;
                    break;

                case 'png':
                case 'jpeg':
                case 'webp':
                    scale = 3;
                    width = Math.min(clientWidth * 1.5, 2400);
                    height = width / aspectRatio;
                    break;
            }

            // Generate and download the image
            Plotly.toImage(plotElement, {
                format: downloadFormat,
                width, height, scale, filename: fileName,
                imageDataOnly: false,
                data: exportData,
                layout: exportLayout
            }).then(dataUrl => {
                if (downloadFormat !== 'svg') {
                    const img = new Image();
                    img.onload = function () {
                        const canvas = document.createElement('canvas');
                        canvas.width = this.width;
                        canvas.height = this.height;

                        const ctx = canvas.getContext('2d');
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';
                        ctx.drawImage(this, 0, 0);

                        let finalDataUrl = downloadFormat === 'jpeg'
                            ? canvas.toDataURL(`image/${downloadFormat}`, 0.95)
                            : canvas.toDataURL(`image/${downloadFormat}`);

                        downloadFile(finalDataUrl, `${fileName}.${downloadFormat}`);
                        setIsDownloadMenuOpen(false);
                    };
                    img.src = dataUrl;
                }
                else {
                    downloadFile(dataUrl, `${fileName}.${downloadFormat}`);
                    setIsDownloadMenuOpen(false);
                }
            }).catch(err => {
                console.error(`Error generating image:`, err);
                toast.error(`Failed to generate ${downloadFormat.toUpperCase()} image. Please try another format.`, TOAST_OPTIONS);
            });
        }
        catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download chart. Please try again.', TOAST_OPTIONS);
        }
    }, [chartType, xAxis, yAxis, layout, chartTrace, downloadFormat]);

    const getFormatTooltip = (format) => {
        switch (format) {
            case 'svg':
                return 'Vector format, best for print & scaling';
            case 'png':
                return 'Lossless raster format, good for web';
            case 'jpeg':
                return 'Compressed image format, smaller file size';
            case 'webp':
                return 'Modern compressed format, good for web';
            case 'pdf':
                return 'Document format, good for reports & print';
            default:
                return '';
        }
    };// remove

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-3 text-foreground">Data Visualization</h2>

            {/* Configuration Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">
                        Sheet
                    </label>
                    <select
                        className="w-full p-2 rounded border bg-muted border-primary/10 outline-none text-sm"
                        onChange={handleSheetSelection}
                        value={selectedSheet}
                    >
                        {sheetNames.map((sheet, index) => (
                            <option className='bg-secondary text-secondary-foreground text-sm' key={sheet} value={index}>{sheet}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">
                        Chart Type
                    </label>
                    <select
                        className="w-full p-2 rounded border bg-muted border-primary/10 outline-none text-sm"
                        onChange={e => setChartType(e.target.value)}
                        value={chartType}
                    >
                        {
                            CHART_OPTIONS.map(({ label, value }) => (
                                <option
                                    key={value}
                                    value={value}
                                    className="bg-secondary text-secondary-foreground text-sm"
                                >
                                    {label}
                                </option>
                            ))
                        }
                    </select>
                </div>
            </div>

            {/* Axis Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AxisSelector label="X Axis" options={headers} value={xAxis} onSelect={setXAxis} />
                <AxisSelector label="Y Axis" options={headers} value={yAxis} onSelect={setYAxis} />
                {chartType.includes('3d') && (
                    <AxisSelector
                        label="Z Axis"
                        options={headers}
                        value={zAxis}
                        onSelect={setZAxis}
                    />
                )}
            </div>

            {/* Warning for non-numeric columns */}
            {showNumericWarning && (
                <div className="text-amber-500 dark:text-amber-400 text-sm p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    Warning: Selected columns should be numeric for this chart type.
                </div>
            )}

            {/* Chart Options */}
            <ChartOptions chartType={chartType} onOptionsChange={handleOptionsChange} />

            {/* Plot Container */}
            <div className="border w-[100%] h-[500px] rounded-lg p-4 bg-muted">
                <ErrorBoundary>
                    <Plot
                        ref={plotRef}
                        data={[chartTrace]}
                        layout={layout}
                        config={{
                            responsive: true,
                            displayModeBar: true,
                            displaylogo: false,
                            modeBarButtons: [['resetViews', 'zoomIn2d', 'zoomOut2d']]
                        }}
                        style={{ width: "100%", height: "100%" }}
                        useResizeHandler={true}
                    />
                </ErrorBoundary>
            </div>

            {/* Download Options */}
            <div className="flex justify-end">
                <div className="relative" ref={downloadMenuRef}>
                    <div className="flex">
                        <button
                            onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                            className="px-4 py-2 bg-muted text-muted-foreground border border-r-0 border-primary/10 text-sm rounded-l-sm hover:bg-muted/80 hover:text-foreground cursor-pointer"
                        >
                            Format: {downloadFormat.toUpperCase()}
                            <span className="ml-2">{isDownloadMenuOpen ? '▲' : '▼'}</span>
                        </button>
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-r-sm hover:bg-primary/90 cursor-pointer"
                        >
                            Download Chart
                        </button>
                    </div>

                    {isDownloadMenuOpen && (
                        <div className="absolute right-0 mt-1 w-64 bg-card border border-primary/10 shadow-lg rounded-md z-10">
                            <div className="py-1 px-2 bg-muted text-sm font-medium text-muted-foreground rounded-t-md">
                                Select Format
                            </div>
                            <ul className="py-1">
                                {DOWNLOAD_OPTIONS.map(option => (
                                    <li
                                        key={option.value}
                                        onClick={() => handleFormatSelect(option.value)}
                                        className="px-3 py-2 hover:bg-muted/50 cursor-pointer flex justify-between items-center"
                                    >
                                        <span className="text-sm">{option.label}</span>
                                        {downloadFormat === option.value && (
                                            <span className="text-primary">✓</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <div className="p-2 text-xs text-muted-foreground bg-muted/30 rounded-b-md">
                                <p>Suggested format: <strong>{downloadFormat.toUpperCase()}</strong></p>
                                <p>{getFormatTooltip(downloadFormat)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChartBuilder