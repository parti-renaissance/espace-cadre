import React from 'react';
import PropTypes from 'prop-types';

const ColumnFilter = ({ column }) => {
    const { filterValue, setFilter } = column;
    return (
        <span>
            <input
                className="form-control"
                style={{ maxWidth: '20rem' }}
                value={filterValue || ''}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search"
            />
        </span>
    );
};

export default ColumnFilter;

ColumnFilter.propTypes = {
    column: PropTypes.object.isRequired,
}
