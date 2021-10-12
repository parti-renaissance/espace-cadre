import React, { useState, useEffect } from 'react';
import {
    Grid, Button, makeStyles, createStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { apiClient } from '../../services/networking/client';
import RiposteCard from './Card';

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
    const [ripostesItems, setRipostesItems] = useState();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
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
    }, []);

    return (
        <Grid container justifyContent="space-between">
            <Grid item className={classes.pageTitle}>
                Riposte
            </Grid>
            <Grid item className={classes.buttonContainer}>
                <Button className={classes.createButton} onClick={handleClickOpen}>
                    <AddIcon className={classes.icon} />Créer une riposte
                </Button>
            </Grid>
            <RiposteCard ripostesItems={ripostesItems} handleClickOpen={handleClickOpen} handleClose={handleClose} open={open} />
        </Grid>
    );
};

export default Ripostes;
