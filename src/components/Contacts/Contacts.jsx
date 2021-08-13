/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Container, Grid } from '@material-ui/core';
import { apiClient } from '../../services/networking/client';
import { useColumnsTitleCache, useInterestsCache } from '../../redux/contacts/hooks';
import ContactsFilters from './ContactsFilters';
import TableHeadComponent from './TableHeadComponent/TableHeadComponent';
import ErrorComponent from '../ErrorComponent';
import Loader from '../Loader';
import Filter from './ContactsFilters/Filter';

function Contacts() {
    const [columnsTitle, setColumnsTitle] = useColumnsTitleCache();
    const [interests] = useInterestsCache();
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const getColumnsTitle = async () => {
        try {
            setColumnsTitle(await apiClient.get('v3/adherents/columns'));
        } catch (error) {
            setHasError(true);
            setErrorMessage(error);
        }
    };

    useEffect(() => {
        if (columnsTitle.length) {
            return;
        }
        getColumnsTitle();
    }, []);

    useEffect(() => {
        console.log(interests);
    }, [interests]);

    const ContactsContent = () => {
        if (columnsTitle.length > 0) {
            return (
                <>
                    <Filter columns={columnsTitle.filter((column) => column.filter !== undefined)} onSubmit={(filters) => console.log(filters)} />
                    <Grid container>
                        <TableHeadComponent columnsTitle={columnsTitle} />
                    </Grid>
                </>
            );
        }
        if (hasError) {
            return <ErrorComponent errorMessage={errorMessage} />;
        }
        return (
            <div style={{ textAlign: 'center' }} className="with-background dc-container">
                <Loader />
            </div>
        );
    };

    return (
        <Container maxWidth="xl" className="contacts-container">
            {ContactsContent()}
        </Container>
    );
}

export default Contacts;
