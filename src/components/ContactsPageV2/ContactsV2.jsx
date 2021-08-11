/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { Container, Grid } from '@material-ui/core';
import { apiClient } from '../../services/networking/client';
import { useColumnsTitleCache } from '../../redux/contacts/hooks';
import FiltersBlock from './FiltersBlock';
import TableHeadComponent from './TableHeadComponent/TableHeadComponent';

function ContactsV2() {
    const [columnsTitle, setColumnsTitle] = useColumnsTitleCache();

    const getColumnsTitle = async () => {
        try {
            setColumnsTitle(await apiClient.get('v3/adherents/columns'));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getColumnsTitle();
    }, []);

    return (
        <Container maxWidth="xl" className="contacts-container">
            <Grid container>
                <FiltersBlock />
            </Grid>
            <Grid container className="with-background dc-container contacts-table">
                <Grid item xs={12}>
                    <TableHeadComponent columnsTitle={columnsTitle} />
                </Grid>
            </Grid>
        </Container>
    );
}

export default ContactsV2;
