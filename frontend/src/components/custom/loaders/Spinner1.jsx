import React from 'react'

function Spinner1({ className }) {
    return (
        <div className={`w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin ${className}`}></ div>
    )
}

export default Spinner1