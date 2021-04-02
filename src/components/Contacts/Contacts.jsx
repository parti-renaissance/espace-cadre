import { useState, useEffect, useMemo } from 'react';

import TableContainer from './TableContainer/TableContainer';
import { COLUMNS } from './Columns';
import ColumnFilter from './ColumnFilter';

export const Contacts = () => {
    const [data, setData] = useState([]);

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

    // Set the columns headers
    const columns = useMemo(() => COLUMNS, []);

    // Set the search input to every column
    const defaultColumn = useMemo(() => {
        return {
            Filter: ColumnFilter
        }
    }, []);

    return (
        <div>
            <TableContainer
                columns={columns}
                data={data}
                defaultColumn={defaultColumn}
            />
        </div>
    )
}

export default Contacts;
