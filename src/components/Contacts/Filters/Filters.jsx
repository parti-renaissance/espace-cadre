import React, { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import Factory from '../../Filter/Factory';

const Filters = ({ columns, onSubmit }) => {
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
            <div className="filters-block-container">
                <Grid container spacing={2} style={{ marginBottom: '10px' }}>
                    {filterElements}
                </Grid>
                <Button type="submit" className="button-filter">Filtrer</Button>
            </div>
        </form>
    );
};

Filters.propTypes = {
    columns: PropTypes.arrayOf(Object).isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default Filters;
