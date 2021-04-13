import React, { useState, useEffect, useMemo } from 'react';

import Spinner from '../Spinner/Spinner';

import TableContainer from './TableContainer/TableContainer';
import ColumnFilter from './ColumnFilter';

const Contacts = () => {
    const [data, setData] = useState([]);
    const [columnsTitle, setColumnsTitle] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);

    // Get the data for the table
    useEffect(() => {
        const getContactsAndColumnsTitles = async () => {
            setLoading(true);
            setError(false);

            try {
                const response = await fetch('https://middleware-api-x44qrxc7fq-ew.a.run.app/contacts');

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
            } catch (error) {
                setError(true);
            }
        };
        getContactsAndColumnsTitles();
    }, []);

    // Set the search input to every column
    const defaultColumn = useMemo(() => ({
        Filter: ColumnFilter,
    }), []);

    const content = () => {
        if (error) {
            return <div className="alert alert-danger w-50" role="alert">Erreur dans le chargement de la page</div>

        } else if (loading && !error) {
            return <Spinner />
        } else if (!loading && !error) {
            return < TableContainer
                columns={columnsTitle}
                data={data}
                defaultColumn={defaultColumn}
            />
        }

    };

    return (
        <div>
            {content()}
        </div>
    );
};

export default Contacts;
