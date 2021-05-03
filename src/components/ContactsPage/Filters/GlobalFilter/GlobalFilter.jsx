/* eslint-disable no-shadow,react/require-default-props */
import React, { useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import PropTypes from 'prop-types';

// Allow to search in every column of the table
const GlobalFilter = ({ filter, setFilter, count }) => {
    const [value, setValue] = useState(filter);
    const countLength = count.length;
    // Wait 1/2 second before updating the table datas with the search term
    const onChange = useAsyncDebounce((value) => {
        setFilter(value || undefined);
    }, 200);

    return (
        <input
            id="globalFilter"
            type="text"
            placeholder={`Chercher: ${countLength} contacts...`}
            value={value || ''}
            onChange={(e) => {
                setValue(e.target.value);
                onChange(e.target.value);
            }}
        />
    );
};

export default GlobalFilter;

GlobalFilter.propTypes = {
    filter: PropTypes.string,
    setFilter: PropTypes.func.isRequired,
    count: PropTypes.arrayOf(PropTypes.object).isRequired,
};
