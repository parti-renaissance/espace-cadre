import React, { useState } from 'react';
import {
    Button, createStyles, Grid, makeStyles, Box,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Factory from './FiltersFactory/Factory';

const useStyles = makeStyles((theme) => createStyles({
    boxContainer: {
        marginTop: '16px',
    },
    filtersContainer: {
        marginBottom: '10px',
    },
    buttonContainer: {
        marginBottom: '16px',
    },
    buttonFilter: {
        color: theme.palette.whiteCorner,
        background: `${theme.palette.gray700}`,
        marginRight: '16px',
        borderRadius: '8.35px',
        '&:hover': {
            background: theme.palette.gray600,
        },
    },
    resetButtonFilters: {
        color: theme.palette.gray700,
        border: `1px solid ${theme.palette.gray300}`,
        borderRadius: '8.35px',
        '&:hover': {
            background: theme.palette.gray200,
        },
    },
}));

const FiltersForm = ({
    filters, onSubmit, onReset, values,
}) => {
    const [localValues, setLocalValues] = useState(values);
    const factory = new Factory();
    const filterElements = [];
    const classes = useStyles();

    filters.forEach((filter) => {
        const filterElement = factory.create(filter.type || 'text', {
            filter,
            value: localValues[filter.code] || '',
            onChange: (value) => {
                setLocalValues((prevState) => {
                    const newState = { ...prevState };

                    newState[filter.code] = value;

                    if (value === null) {
                        delete newState[filter.code];
                    }

                    return newState;
                });
            },
        });

        if (filterElement) {
            filterElements.push(<Grid key={filter.code} item xs={12} sm={6} lg={4}>{filterElement}</Grid>);
        }
    });

    if (!filterElements.length) {
        return null;
    }

    return (
        <Box className={classes.boxContainer}>
            <form onSubmit={(event) => {
                event.preventDefault();
                onSubmit(localValues);
            }}
            >
                <Grid container spacing={2} className={classes.filtersContainer}>
                    {filterElements}
                </Grid>
                <Grid container className={classes.buttonContainer}>
                    <Button
                        type="submit"
                        className={classes.buttonFilter}

                    >Filtrer
                    </Button>
                    <Button
                        className={classes.resetButtonFilters}
                        onClick={() => {
                            setLocalValues({});
                            onReset();
                        }}
                    >Réinitialiser
                    </Button>
                </Grid>
            </form>
        </Box>
    );
};

FiltersForm.propTypes = {
    filters: PropTypes.arrayOf(Object).isRequired,
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    values: PropTypes.objectOf(Object).isRequired,
};

export default FiltersForm;
