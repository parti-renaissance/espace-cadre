import { useState, useEffect, useMemo } from 'react';

import TableContainer from './TableContainer/TableContainer';
import { COLUMNS } from './Columns';
import ColumnFilter from './ColumnFilter';

export const Contacts = () => {
    const [data, setData] = useState([]);
    const [columnsTitle, setColumnsTitle] = useState([]);

    // Get the data for the table
    useEffect(() => {
        const getContactsAndColumnsTitles = async () => {
            const response = await fetch("https://middleware-api-x44qrxc7fq-ew.a.run.app/contacts/");
            const body = await response.json();

            const columnsTitle = (Object.keys(body[0]));
            const columns = columnsTitle.map((title, i) => {
                const cleanTitle = title.replace('_', ' ');
                return {
                    Header: cleanTitle,
                    accessor: title
                }
            });
            setColumnsTitle(columns)
            setData(body)
        }
        getContactsAndColumnsTitles()
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
                columns={columnsTitle}
                data={data}
                defaultColumn={defaultColumn}
            />
        </div>
    )
}

export default Contacts;
