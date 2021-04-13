import React, { useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import PropTypes from "prop-types";

// Allow to search in every column of the table
const GlobalFilter = ({ filter, setFilter }) => {
    const [value, setValue] = useState(filter);

    // Wait 1/2 second before updating the table datas with the search term
    const onChangeDelay = useAsyncDebounce((value) => {
        setFilter(value || undefined);
    }, 500);

    return (
        <span style={{ margin: '1rem' }}>
            Recherche dans l&apos;ensemble des contacts:
            {' '}
            {' '}
            <input
                style={{ margin: '.5rem 1rem', maxWidth: '25rem' }}
                className="form-control"
                placeholder="Recherchez ici..."
                value={value || ''}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChangeDelay(e.target.value);
                }}
            />
        </span>
    );
};

export default GlobalFilter;

GlobalFilter.propTypes = {
    filter: PropTypes.string,
    setFilter: PropTypes.func.isRequired,
}
