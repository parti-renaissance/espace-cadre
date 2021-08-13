import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import Factory from '../../Filter/Factory';

const Filter = ({ columns, onSubmit }) => {
    const [filters, setFilters] = useState({});

    const factory = new Factory();

    const filterElements = [];

    columns.forEach((column) => {
        const filter = factory.create({
            type: column.filter.type || 'text',
            column,
            value: filters[column.key] || '',
            onChange: (event) => {
                setFilters((prevState) => {
                    const newState = { ...prevState };
                    newState[column.key] = event.target.value;

                    return newState;
                });
            },
        });

        if (filter) {
            filterElements.push(filter);
        }
    });

    if (!filterElements.length) {
        return null;
    }

    return (
        <form onSubmit={(event) => { event.preventDefault(); onSubmit(filters); }}>
            <div className="with-background dc-container filters-block-container">
                {filterElements}
                <Button
                    type="submit"
                    className="button-filter"
                >Filtrer
                </Button>
            </div>
        </form>
    );
};

Filter.propTypes = {
    columns: PropTypes.arrayOf(Object).isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default Filter;
