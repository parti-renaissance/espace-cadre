import React from 'react';
import PropTypes from 'prop-types';

// Allow to search in a specific column
const ColumnFilter = ({ column }) => {
    const { filterValue, setFilter } = column;
    return (
        <span>
            <input
                type="text"
                value={filterValue || ''}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search..."
                className="input-filter"
            />
        </span>
    );
};

export default ColumnFilter;

ColumnFilter.propTypes = {
    column: PropTypes.objectOf(Object).isRequired,
};
