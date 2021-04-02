import React from 'react';

const ColumnFilter = ({ column }) => {
    const { filterValue, setFilter } = column;
    return (
        <span>
            <input
                className="form-control"
                style={{maxWidth: "20rem"}}
                value={filterValue || ''}
                onChange={e => setFilter(e.target.value)}
                placeholder="Search" />
        </span>
    )
}

export default ColumnFilter;