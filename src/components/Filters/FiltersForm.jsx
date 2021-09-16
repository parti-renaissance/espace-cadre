import React, { useState } from 'react';
import {
    Button, Grid, makeStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Factory from './FiltersFactory/Factory';

const useStyles = makeStyles({
    filtersContainer: {
        marginBottom: '10px',
    },
});

const FiltersForm = ({
    filters, onSubmit, onReset, values,
}) => {
    const [localValues, setLocalValues] = useState(values);
    const factory = new Factory();
    const filterElements = [];
    const classes = useStyles();

    filters.forEach((column) => {
        const filter = factory.create(column.filter.type || 'text', {
            column,
            value: localValues[column.key] || '',
            onChange: (value) => {
                setLocalValues((prevState) => {
                    const newState = { ...prevState };
                    newState[column.key] = value;

                    return newState;
                });
            },
        });

        if (filter) {
            filterElements.push(<Grid key={column.key} item xs={12} sm={6} md={3}>{filter}</Grid>);
        }
    });

    if (!filterElements.length) {
        return null;
    }

    return (
        <>
            <form onSubmit={(event) => {
                event.preventDefault();
                onSubmit(localValues);
            }}
            >
                <div className="filters-block-container">
                    <Grid container spacing={2} className={classes.filtersContainer}>
                        {filterElements}
                    </Grid>
                    <Grid container>
                        <Button type="submit" className="button-filter">Filtrer</Button>
                        <Button
                            className="reset-button-filters"
                            onClick={() => {
                                setLocalValues({});
                                onReset();
                            }}
                        >Réinitialiser
                        </Button>
                    </Grid>
                </div>
            </form>
        </>
    );
};

FiltersForm.propTypes = {
    filters: PropTypes.arrayOf(Object).isRequired,
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    values: PropTypes.objectOf(Object).isRequired,
};

export default FiltersForm;
