import React, { useState, useEffect, useMemo } from 'react';

import TableContainer from './TableContainer/TableContainer';
import ColumnFilter from './ColumnFilter';

const Contacts = () => {
    const [data, setData] = useState([]);
    const [columnsTitle, setColumnsTitle] = useState([]);
    const [loading, setLoading] = useState(false)

    // Get the data for the table
    useEffect(() => {
        const getContactsAndColumnsTitles = async () => {
            setLoading(true);
            const response = await fetch('https://middleware-api-x44qrxc7fq-ew.a.run.app/contacts/');
            if (!response.ok) {
                const message = `An error has occured: ${response.status}`;
                throw new Error(message);
            }
            const body = await response.json();
            const columnsTitle = (Object.keys(body[0]));
            const columns = columnsTitle.map((title) => {
                const cleanTitle = title.replace('_', ' ');
                return {
                    Header: cleanTitle,
                    accessor: title,
                };
            });
            setColumnsTitle(columns);
            setData(body);
            setLoading(false);
        };
        getContactsAndColumnsTitles();
    }, []);

    // Set the search input to every column
    const defaultColumn = useMemo(() => ({
        Filter: ColumnFilter,
    }), []);

    return (
        <div>
            {loading ?
                <div className="d-flex flex-column align-items-center justify-content-center" style={{marginTop:"calc(100vh - 70vh)"}}>
                    <div className="row mb-2">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                    <div className="row">
                        <strong>Page en cours de chargement</strong>
                    </div>
                </div>
                :
                <TableContainer
                    columns={columnsTitle}
                    data={data}
                    defaultColumn={defaultColumn}
                />}
        </div>
    );
};

export default Contacts;
