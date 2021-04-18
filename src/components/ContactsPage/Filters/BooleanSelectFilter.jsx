/* eslint-disable react/no-array-index-key,no-shadow */
import React from 'react';
import PropTypes from 'prop-types';

// Render a select to filter inside a column
const SelectFilter = ({
    column: {
        filterValue, setFilter, preFilteredRows, id,
    },
}) => {
    const options = React.useMemo(() => {
        const options = new Set();
        preFilteredRows.forEach((row) => {
            options.add(row.values[id]);
        });
        return [...options.values()];
    }, [id, preFilteredRows]);

    return (
        <select
            value={filterValue}
            onChange={(e) => {
                setFilter(e.target.value || undefined);
            }}
            className="form-control"
        >
            <option value="">Tous</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option ? 'Oui' : 'Non'}
                </option>
            ))}
        </select>
    );
};

export default SelectFilter;

SelectFilter.propTypes = {
    column: PropTypes.objectOf(Object).isRequired,
};
