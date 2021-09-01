/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
    Container, TableContainer, Paper, Table,
} from '@material-ui/core';
import qs from 'qs';
import { apiClient } from '../../services/networking/client';
import { useColumnsTitleCache, useContactsCache } from '../../redux/contacts/hooks';
import TableHeadComponent from './TableHeadComponent';
import TableBodyComponent from './TableBodyComponent';
import ErrorComponent from '../ErrorComponent';
import Loader from '../Loader';
import Filter from './Filters';

function Contacts() {
    const [columnsTitle, setColumnsTitle] = useColumnsTitleCache();
    const [contacts, setContacts] = useContactsCache();
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const getColumnsTitle = async () => {
        try {
            setColumnsTitle(await apiClient.get('v3/adherents/columns'));
            setContacts(await apiClient.get('v3/adherents'));
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

    const handleSubmit = async (filters) => {
        const query = qs.stringify(filters);

        setContacts(await apiClient.get(`v3/adherents?${query}`));
    };

    const ContactsContent = () => {
        if (columnsTitle.length > 0) {
            return (
                <>
                    <Filter columns={columnsTitle.filter((column) => column.filter !== undefined)} onSubmit={(filters) => handleSubmit(filters)} />
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHeadComponent columnsTitle={columnsTitle} />
                            <TableBodyComponent contacts={contacts} columnsTitle={columnsTitle} />
                        </Table>
                    </TableContainer>
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
