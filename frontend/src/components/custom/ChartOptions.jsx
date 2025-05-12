import { useState } from 'react'
import { CaretRight, CaretDown } from '@/utils'

function ChartOptions({
    onOptionsChange,
    chartType
}) {

    const colorSchemeOptionsForSelect = [
        { label: 'Default', value: 'default' },
        { label: 'Viridis', value: 'viridis' },
        { label: 'Plasma', value: 'plasma' },
        { label: 'Warm', value: 'warm' },
        { label: 'Cool', value: 'cool' },
    ];
    const [showOptions, setShowOptions] = useState(false);
    const [colorScheme, setColorScheme] = useState('default');
    
    const [markerSize, setMarkerSize] = useState(8);
    const [showLegend, setShowLegend] = useState(true);

    const handleOptionChange = (option, value) => {
        let newOptions = {};

        switch (option) {
            case 'colorScheme':
                setColorScheme(value);
                newOptions.colorScheme = value;
                break;
            case 'markerSize':
                setMarkerSize(parseInt(value));
                newOptions.markerSize = parseInt(value);
                break;
            case 'showLegend':
                setShowLegend(value);
                newOptions.showLegend = value;
                break;
        }
        onOptionsChange(newOptions);
    };

    // Only show options relevant to the current chart type
    const showMarkerSizeOption = chartType === 'scatter' || chartType === 'scatter3d';

    return (
        <div className="mt-4">
            <button
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center text-sm text-foreground hover:text-foreground/70 cursor-pointer"
            >
                {showOptions ?
                    <>
                        <CaretDown size={16} />&nbsp;
                        Hide
                    </>
                    :
                    <>
                        <CaretRight size={16} />&nbsp;
                        Show
                    </>
                } Advanced Options
            </button>
            {
                showOptions && (
                    <div className="mt-1 p-3 bg-muted/30 border rounded-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">
                                Color Scheme
                            </label>
                            <select
                                className="w-full p-2 rounded border bg-muted border-primary/10 outline-none text-sm"
                                value={colorScheme}
                                onChange={(e) => handleOptionChange('colorScheme', e.target.value)}
                            >
                                {
                                    colorSchemeOptionsForSelect.map(({ label, value }) => (
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


                        {showMarkerSizeOption && (
                            <div>
                                <label className="block text-sm font-medium mb-2 text-foreground">
                                    Marker Size
                                </label>
                                <input
                                    type="range"
                                    min="2"
                                    max="8"
                                    value={markerSize}
                                    onChange={(e) => handleOptionChange('markerSize', e.target.value)}
                                    className="w-full cursor-pointer"
                                />
                                <div className="text-xs text-muted-foreground">Value: {markerSize}</div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-2.5 text-foreground">Show Legend</label>
                            <div className='flex items-center gap-2'>
                                <input
                                    type="checkbox"
                                    checked={showLegend}
                                    onChange={(e) => handleOptionChange('showLegend', e.target.checked)}
                                    className="h-4 w-4 cursor-pointer"
                                />
                                <span className="text-xs text-foreground mb-0.5">Display legend</span>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>

    )
}

export default ChartOptions