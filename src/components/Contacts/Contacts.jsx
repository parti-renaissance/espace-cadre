import { useState, useEffect, useMemo } from 'react';

import TableContainer from './TableContainer/TableContainer';
import { COLUMNS } from './Columns';
import ColumnFilter from './ColumnFilter';

export const Contacts = () => {
    const [data, setData] = useState([]);
    const [columnsTitle, setColumnsTitle] = useState([]);

    // Get the contacts data
    useEffect(() => {
        const getContacts = async () => {
            const response = await fetch("https://python-api-cloudrun-gcr-staging-x44qrxc7fq-ew.a.run.app/contacts/")
            const body = await response.json()
            const contacts = body;
            setData(contacts)
        }
        getContacts()
    }, []);

    // Fetch dynamically columns titles
    useEffect(() => {
        const dynamicColumns = async () => {
            const response = await fetch("https://python-api-cloudrun-gcr-staging-x44qrxc7fq-ew.a.run.app/contacts/");
            const body = await response.json();
            
            const columnsTitle = (Object.keys(body[0]));
            const columns = columnsTitle.map((title, i) => {
                const cleanTitle = title.replace('_', ' ');
                return {
                    Header: cleanTitle,
                    accessor: title
                }
            })
            setColumnsTitle(columns)
        }
        dynamicColumns()
    }, []);

    // Set the search input to every column
    const defaultColumn = useMemo(() => {
        return {
            Filter: ColumnFilter
        }
    }, []);

    return (
        <div>
            <TableContainer
                columns={columnsTitle}
                data={data}
                defaultColumn={defaultColumn}
            />
        </div>
    )
}

export default Contacts;
