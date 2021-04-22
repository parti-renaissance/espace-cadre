/* eslint-disable no-shadow,react/prop-types,react/display-name */
import React, { useState, useEffect } from 'react';

import Table from '../Table/Table';
import InterestRendering from '../ColumnsContentRendering/InterestRendering';
import BooleanRendering from '../ColumnsContentRendering/BooleanRendering';

import ColumnFilter from '../Filters/ColumnFilter/ColumnFilter';
import SelectFilter from '../Filters/SelectFilter/SelectFilter';
import BooleanSelectFilter from '../Filters/BooleanSelectFilter/BooleanSelectFilter';
import MultiSelectFilter from '../Filters/MultiSelectFilter/MultiSelectFilter';

import Spinner from '../../Spinner/Spinner';
import { apiClientProxy } from '../../../services/networking/client';

import './Contacts.scss';

const Contacts = () => {
    const [data, setData] = useState([]);
    const [columnsTitle, setColumnsTitle] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // Get the data for the table
    useEffect(() => {
        const getContactsAndColumnsTitles = async () => {
            try {
                setLoading(true);
                setError(false);
                const body = await apiClientProxy.get('/contacts');
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
                            return MultiSelectFilter;
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

                    // Specific hook for multiselect
                    const includeSome = () => (title === "Centres_d'intérêt" ? 'includesSome' : null);

                    return {
                        Header: cleanTitle,
                        accessor: title,
                        Filter: typeOfFilter(),
                        filter: includeSome(),
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

    // Handle error on fetch, async loading with spinner and rendering when loaded
    const content = () => {
        if (error) {
            return <div className="alert alert-danger w-50" role="alert">Erreur dans le chargement de la page</div>;
        } if (loading) {
            return <Spinner />;
        }
        return (
            <Table
                columns={columnsTitle}
                data={data}
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
