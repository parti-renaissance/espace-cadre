/* eslint-disable no-shadow,react/prop-types,react/display-name */
import React, { useState, useEffect } from 'react';

import Table from '../Table/Table';
import InterestRendering from '../ColumnsContentRendering/InterestRendering/InterestRendering';
import BooleanRendering from '../ColumnsContentRendering/BooleanRendering/BooleanRendering';

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
        /* Variable used for cleanup the component when unmount.
         Avoid memory leak causing weird behaviour */
        let isActive = true;

        const getContactsAndColumnsTitles = async () => {
            try {
                setLoading(true);
                setError(false);
                const body = await apiClientProxy.get('/contacts');
                const columnsTitle = (Object.keys(body.contacts[0]));
                const columns = columnsTitle.map((title) => {
                    const columnDef = {
                        Header: title.replace('_', ' '),
                        accessor: title,
                        Filter: '',
                    };

                    if (['Genre'].indexOf(title) !== -1) {
                        columnDef.Filter = SelectFilter;
                    } else if (['Abonné_email', 'Abonné_tel'].indexOf(title) !== -1) {
                        columnDef.Filter = BooleanSelectFilter;
                        columnDef.Cell = (props) => <BooleanRendering bool={props} />;
                    } else if (["Centres_d'intérêt"].indexOf(title) !== -1) {
                        columnDef.Filter = MultiSelectFilter;
                        columnDef.filter = 'includesSome';
                        columnDef.Cell = (props) => <InterestRendering interest={props} />;
                        columnDef.interests = body.interests_choices;
                    } else if (['id'].indexOf(title) === -1) {
                        // default Filter
                        columnDef.Filter = ColumnFilter;
                    }

                    return columnDef;
                });
                if (isActive) {
                    /* Update state only if the user is still on the page
                    In other words, if the component is still mounted
                    */
                    setColumnsTitle(columns);
                    setData(body.contacts);
                    setLoading(false);
                }
            } catch (error) {
                if (isActive) {
                    setError(true);
                }
            }
        };
        getContactsAndColumnsTitles();

        return () => {
            /* Component unmount when exiting the page.
            Component state is not updated, no memory leak
            */
            isActive = false;
        };
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
