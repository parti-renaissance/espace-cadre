import React, { useState, useEffect } from 'react';
import {
    Grid, Button, makeStyles, createStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { apiClient } from '../../services/networking/client';
import Card from './Card';
import Modal from './Modal';

const useStyles = makeStyles((theme) => createStyles({
    pageTitle: {
        fontSize: '24px',
        fontWeight: '400',
        color: theme.palette.gray800,
    },
    buttonContainer: {
        color: theme.palette.teal700,
        background: theme.palette.riposteActionButton,
        borderRadius: '8.35px',
        marginBottom: '32px',
    },
    icon: {
        marginRight: '8px',
    },
    createButton: {
        color: theme.palette.teal700,
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

    const handleClickMenu = (id) => {
        ripostesItems.find((el) => {
            if (el.uuid === id) {
                console.log(el);
            }
        });
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
            ripostesData.reverse();
            setRipostesItems(ripostesData);
        };

        getRipostes();
    }, [refreshPage]);

    return (
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
                    <Card
                        key={i}
                        item={item}
                        handleClickOpen={handleClickOpen}
                        handleClickMenu={handleClickMenu}
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
    );
};

export default Ripostes;
