/* eslint-disable no-shadow,react/display-name */
import React, { useState, useEffect } from 'react';

import Table from './Table/Table';
import InterestRendering from './ColumnsContentRendering/InterestRendering';
import BooleanRendering from './ColumnsContentRendering/BooleanRendering';

import ColumnFilter from './Filters/ColumnFilter';
import SelectFilter from './Filters/SelectFilter';
import BooleanSelectFilter from './Filters/BooleanSelectFilter';
import MultiSelectFilter from './Filters/MultiSelectFilter';

import ContactsTableLoader from '../Loaders/ContactsTableLoader';

import { apiClientProxy } from '../../services/networking/client';
import { useContactsCache } from '../../redux/contacts/hooks';

const Contacts = () => {
    const [columnsTitle, setColumnsTitle] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [contacts, setContacts] = useContactsCache();

    // Get the data for the table
    useEffect(() => {
        /* Variable used for cleanup the component when unmount.
         Avoid memory leak causing weird behaviour */
        let isActive = true;

        const getContactsAndColumnsTitles = async () => {
            try {
                setError(false);
                setLoading(true);
                if (contacts === null) {
                    setContacts(await apiClientProxy.get('/contacts'));
                }
                const columnsTitle = (Object.keys(contacts.contacts[0]));
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
                        columnDef.interests = contacts.interestsChoices;
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
    }, [contacts]);

    // Handle error on fetch, async loading with spinner and rendering when loaded
    const content = () => {
        if (error) {
            return <div className="alert alert-danger w-50" role="alert">Erreur dans le chargement de la page</div>;
        }
        if (loading) {
            return <ContactsTableLoader />;
        }
        return (contacts !== null && <Table columns={columnsTitle} data={contacts.contacts} />);
    };

    return (
        <>
            {content()}
        </>
    );
};

export default Contacts;
