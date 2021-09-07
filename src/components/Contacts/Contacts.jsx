/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
    Container, TableContainer, Paper, Table, TablePagination,
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
    const [filters, setFilters] = useState({ page: 1 });
    const [rowsPerPage] = useState(100);

    useEffect(() => {
        if (columnsTitle.length) {
            return;
        }
        const getColumnsTitle = async () => {
            try {
                setColumnsTitle(await apiClient.get('v3/adherents/columns'));
            } catch (error) {
                setHasError(true);
                setErrorMessage(error);
            }
        };

        getColumnsTitle();
    }, [columnsTitle]);

    useEffect(() => {
        const getContacts = async () => {
            try {
                const query = qs.stringify(filters);
                setContacts(await apiClient.get(`v3/adherents?${query}`));
            } catch (error) {
                setHasError(true);
                setErrorMessage(error);
            }
        };
        getContacts();
    }, [filters]);

    // Reset filters and get initial contacts
    const handleReset = () => {
        setFilters({ page: 1 });
    };

    const ContactsContent = () => {
        if (columnsTitle.length > 0) {
            return (
                <>
                    <Filter
                        columns={columnsTitle.filter((column) => column.filter !== undefined)}
                        values={filters}
                        onSubmit={(newFilters) => setFilters({ ...newFilters, ...{ page: 1 } })}
                        onResetClick={handleReset}
                    />
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHeadComponent
                                columnsTitle={columnsTitle}
                            />
                            <TableBodyComponent
                                contacts={contacts}
                                columnsTitle={columnsTitle}
                            />
                        </Table>
                    </TableContainer>
                    {contacts.metadata && (
                        <TablePagination
                            rowsPerPageOptions={[100]}
                            labelRowsPerPage="Lignes par page:"
                            component="div"
                            count={contacts.metadata.total_items}
                            page={filters.page - 1}
                            onPageChange={(event, page) => setFilters((prevState) => ({ ...prevState, ...{ page: page + 1 } }))}
                            rowsPerPage={rowsPerPage}
                        />
                    )}
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
