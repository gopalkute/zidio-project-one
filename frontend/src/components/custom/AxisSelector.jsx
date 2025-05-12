import React from 'react'

function AxisSelector({
    label,
    options,
    value,
    onSelect,
    optional = false
}) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
                {label}
            </label>
            <select
                className="w-full p-2 rounded border bg-muted border-primary/10 outline-none text-sm"
                onChange={e => onSelect(e.target.value || null)}
                value={value || ''}
            >
                {optional && <option className='bg-secondary text-secondary-foreground text-sm' key={"none"} value="None">None</option>}
                {
                    options.map(opt => (
                        <option className='bg-secondary text-secondary-foreground text-sm' key={opt} value={opt}>{opt}</option>
                    ))
                }
            </select>
        </div>
    );
}

export default AxisSelector