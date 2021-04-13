import React from 'react'

function Spinner() {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ marginTop: "calc(100vh - 70vh)" }}>
            <div className="row mb-2">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
            <div className="row">
                <strong>Page en cours de chargement</strong>
            </div>
        </div>
    )
}

export default Spinner
