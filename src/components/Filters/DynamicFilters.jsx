import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { apiClient } from '../../services/networking/client';
import FiltersForm from './FiltersForm';
import ErrorComponent from '../ErrorComponent';
import Loader from '../Loader';

const DynamicFilters = ({ values, onSubmit, onReset }) => {
    const [filters, setFilters] = useState([]);
    const [errorMessage, setErrorMessage] = useState();

    useEffect(() => {
        if (filters.length) {
            return;
        }

        const getColumnsTitle = async () => {
            try {
                const filtersResults = (await apiClient.get('v3/adherents/columns'));
                filtersResults.push({
                    key: 'birthdate',
                    label: 'Date de naissance',
                    filter: { type: 'date_interval' },
                    options: null,
                });
                setFilters(filtersResults);
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
                    filters={filters.filter((column) => column.filter !== undefined)}
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
            <div style={{ textAlign: 'center' }} className="with-background dc-container">
                <Loader />
            </div>
        );
    };

    return (
        <>
            {dynamicFiltersContent()}
        </>
    );
};

export default DynamicFilters;

DynamicFilters.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    values: PropTypes.objectOf(Object).isRequired,
};
