import React, { useState, useEffect } from 'react';
import {
    Container, Grid, Button, makeStyles, createStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { apiClient } from '../../services/networking/client';
import CardComponent from './Card';
import Modal from './Modal';

const useStyles = makeStyles((theme) => createStyles({
    riposteContainer: {
        marginBottom: '16px',
    },
    pageTitle: {
        fontSize: '24px',
        fontWeight: '400',
        color: theme.palette.gray800,
    },
    buttonContainer: {
        background: theme.palette.riposteBackground,
        borderRadius: '8.35px',
        marginBottom: '32px',
    },
    icon: {
        marginRight: '8px',
    },
    createButton: {
        color: theme.palette.riposteColor,
        padding: '6px 8px',
    },
    root: {
        padding: '16px',
        borderRadius: '8.35px',
    },
}));

const Ripostes = () => {
    const classes = useStyles();
    const [ripostesItems, setRipostesItems] = useState();
    const [currentItem, setCurrentItem] = useState(null);
    const [refreshPage, setRefreshPage] = useState(0);
    const [open, setOpen] = useState(false);

    const handleClickOpen = (id) => {
        setCurrentItem(ripostesItems.find((el) => el.uuid === id) || null);
        setOpen(true);
    };

    const handleActiveItem = async (id) => {
        const item = ripostesItems.find((el) => el.uuid === id);
        const newItem = { ...item, enabled: !item.enabled };
        setRipostesItems((prev) => prev
            .filter((el) => el.uuid !== id)
            .concat(newItem)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        await apiClient.put(`api/v3/ripostes/${newItem.uuid}`, newItem);
        setRefreshPage((p) => p + 1);
    };

    const handleNewRiposte = () => {
        setCurrentItem({
            uuid: null,
            title: '',
            body: '',
            source_url: '',
            with_notification: true,
            enabled: true,
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const getRipostes = async () => {
            const ripostesData = await apiClient.get('api/v3/ripostes');
            setRipostesItems(ripostesData);
        };

        getRipostes();
    }, [refreshPage]);

    return (
        <Container maxWidth="lg" className={classes.riposteContainer}>
            <Grid container justifyContent="space-between">
                <Grid item className={classes.pageTitle}>
                    Riposte
                </Grid>
                <Grid item className={classes.buttonContainer}>
                    <Button className={classes.createButton} onClick={handleNewRiposte}>
                        <AddIcon className={classes.icon} />Créer une riposte
                    </Button>
                </Grid>
                <Grid container spacing={2}>
                    {ripostesItems && ripostesItems.map((item, i) => (
                        <CardComponent
                            key={i}
                            item={item}
                            handleClickOpen={handleClickOpen}
                            handleActiveItem={handleActiveItem}
                        />
                    ))}
                </Grid>
                <Modal
                    open={open}
                    handleClose={handleClose}
                    riposteItem={currentItem}
                    onSubmitRefresh={() => {
                        setRefreshPage((p) => p + 1);
                    }}
                />
            </Grid>
        </Container>
    );
};

export default Ripostes;
