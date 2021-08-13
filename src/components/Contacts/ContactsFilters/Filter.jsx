import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import Factory from '../../Filter/Factory';

const Filter = ({ columns, onSubmit }) => {
    const [filters, setFilters] = useState({});

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

    console.log(columns);

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

export default Filter;
