import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import Factory from '../../Filter/Factory';

const Filter = ({ columns, onSubmit }) => {
    const [filters, setFilters] = useState({
        first_name: 'Dimitri',
    });

    const factory = new Factory();

    const filterElements = [];

    columns.map((column) => {
        const filter = factory.create(
            column.filter.type || 'text',
            column,
            filters[column.key] || null,
            (event) => {
                setFilters((prevState) => {
                    const newState = { ...prevState };
                    newState[column.key] = event.target.value;

                    return newState;
                });
            },
        );

        if (filter) {
            filterElements.push(filter);
        }
    });

    console.log(filters);

    return (
        <form onSubmit={(event) => { event.preventDefault(); onSubmit(filters); }}>
            <div className="with-background dc-container filters-block-container">
                {filterElements}
                <button type="submit">Filtrer</button>
            </div>
        </form>
    );
};

export default Filter;
