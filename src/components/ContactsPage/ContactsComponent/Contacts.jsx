/* eslint-disable no-shadow,react/prop-types,react/display-name */
import React, { useState, useEffect, useMemo } from 'react';

import './Contacts.scss';
import Table from '../Table/Table';
import InterestRendering from '../ColumnsContentRendering/InterestRendering';
import BooleanRendering from '../ColumnsContentRendering/BooleanRendering';

import ColumnFilter from '../Filters/ColumnFilter';
import SelectFilter from '../Filters/SelectFilter';
import BooleanSelectFilter from '../Filters/BooleanSelectFilter';
import MultiSelectFilter from '../Filters/MultiSelectFilter';

import Spinner from '../../Spinner/Spinner';

const Contacts = () => {
    const [data, setData] = useState([]);
    const [columnsTitle, setColumnsTitle] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // Get the data for the table
    useEffect(() => {
        const getContactsAndColumnsTitles = async () => {
            setLoading(true);
            setError(false);

            try {
                const response = await fetch('https://middleware-api-x44qrxc7fq-ew.a.run.app/contacts');
                const body = await response.json();
                const columnsTitle = (Object.keys(body.contacts[0]));
                const columns = columnsTitle.map((title) => {
                    const cleanTitle = title.replace('_', ' ');
                    // Display a specific filter depending on the column
                    const typeOfFilter = () => {
                        if (title === 'id') {
                            return '';
                        } if (title === 'Genre') {
                            return SelectFilter;
                        } if (title === 'Abonné_email' || title === 'Abonné_tel') {
                            return BooleanSelectFilter;
                        } if (title === "Centres_d'intérêt") {
                            return <MultiSelectFilter />;
                        }
                        return ColumnFilter;
                    };

                    // Display a specific display depending on the content
                    let typeOfCell = () => (props) => props.value || '';

                    if (title === "Centres_d'intérêt") {
                        typeOfCell = () => (props) => <InterestRendering interest={props} />;
                    } else if (title === 'Abonné_tel' || title === 'Abonné_email') {
                        typeOfCell = () => (props) => <BooleanRendering bool={props} />;
                    }

                    return {
                        Header: cleanTitle,
                        accessor: title,
                        Filter: typeOfFilter(),
                        Cell: typeOfCell(),
                    };
                });

                setColumnsTitle(columns);
                setData(body.contacts);
                setLoading(false);
            } catch (error) {
                setError(true);
            }
        };
        getContactsAndColumnsTitles();
    }, []);

    // Set the search input to every column
    const defaultColumn = useMemo(() => ({
        Filter: ColumnFilter,
    }), []);

    // Handle error on fetch, async loading with spinner and rendering when loaded
    const content = () => {
        if (error) {
            return <div className="alert alert-danger w-50" role="alert">Erreur dans le chargement de la page</div>;
        } if (loading && !error) {
            return <Spinner />;
        }
        return (
            <Table
                columns={columnsTitle}
                data={data}
                defaultColumn={defaultColumn}
            />
        );
    };

    return (
        <div>
            {content()}
        </div>
    );
};

export default Contacts;
