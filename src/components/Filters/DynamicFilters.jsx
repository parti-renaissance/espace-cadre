import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, createStyles } from '@material-ui/core';
import { apiClient } from '../../services/networking/client';
import FiltersForm from './FiltersForm';
import ErrorComponent from '../ErrorComponent';
import Loader from '../Loader';

const useStyles = makeStyles(() => createStyles({
    loader: {
        textAlign: 'center',
    },
}));

const DynamicFilters = ({
    feature, values, onSubmit, onReset,
}) => {
    const [filters, setFilters] = useState([]);
    const [errorMessage, setErrorMessage] = useState();
    const classes = useStyles();

    useEffect(() => {
        if (filters.length) {
            return;
        }

        const getColumnsTitle = async () => {
            try {
                setFilters(await apiClient.get(`v3/adherents/filters?feature=${feature}`));
            } catch (error) {
                setErrorMessage(error);
            }
        };

        getColumnsTitle();
    }, [filters]);

    if (!filters.length) {
        return null;
    }

    const dynamicFiltersContent = () => {
        if (filters.length > 0) {
            return (
                <FiltersForm
                    filters={filters}
                    values={values}
                    onSubmit={onSubmit}
                    onReset={onReset}
                />
            );
        }

        if (errorMessage) {
            return <ErrorComponent errorMessage={errorMessage} />;
        }

        return (
            <div className={`with-background dc-container ${classes.loader}`}>
                <Loader />
            </div>
        );
    };
    return dynamicFiltersContent();
};

export default DynamicFilters;

DynamicFilters.defaultProps = {
    onReset: null,
    values: {},
};

DynamicFilters.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    feature: PropTypes.string.isRequired,
    onReset: PropTypes.func,
    values: PropTypes.objectOf(Object),
};
