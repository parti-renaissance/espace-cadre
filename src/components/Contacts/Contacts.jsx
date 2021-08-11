/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { Container, Grid } from '@material-ui/core';
import { apiClient } from '../../services/networking/client';
import { useColumnsTitleCache } from '../../redux/contacts/hooks';
import FiltersBlock from './FiltersBlock';
import TableHeadComponent from './TableHeadComponent/TableHeadComponent';

function Contacts() {
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
            <FiltersBlock columnsTitle={columnsTitle} />
            <Grid container>
                <TableHeadComponent columnsTitle={columnsTitle} />
            </Grid>
        </Container>
    );
}

export default Contacts;
