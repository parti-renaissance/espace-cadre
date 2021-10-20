import React, { useState, useEffect } from 'react';
import {
    Container, makeStyles, createStyles, Grid, Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { apiClient } from '../../services/networking/client';
import CardComponent from './CardComponent';
import TeamsModal from './TeamsModal';

const useStyles = makeStyles((theme) => createStyles({
    teamsContainer: {
        marginBottom: '16px',
    },
    pageTitle: {
        fontSize: '24px',
        fontWeight: '400',
        color: theme.palette.gray800,
    },
    buttonContainer: {
        background: theme.palette.teamBackground,
        borderRadius: '8.35px',
        marginBottom: '32px',
    },
    icon: {
        marginRight: '8px',
    },
    createButton: {
        color: theme.palette.lightBlue700,
        padding: '6px 8px',
    },
    root: {
        padding: '16px',
        borderRadius: '8.35px',
    },
}));

const Teams = () => {
    const classes = useStyles();
    const [teamItems, setTeamsList] = useState();
    const [currentItem, setCurrentItem] = useState(null);
    const [refreshPage, setRefreshPage] = useState(0);
    const [open, setOpen] = useState(false);

    const handleClickOpen = (id) => {
        setCurrentItem(teamItems.find((el) => el.uuid === id) || null);
        setOpen(true);
    };

    const handleNewTeam = () => {
        setCurrentItem({
            uuid: null,
            name: '',
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const getTeams = async () => {
            const teamsData = await apiClient.get('api/v3/teams');
            setTeamsList(teamsData.items);
        };

        getTeams();
    }, [refreshPage]);

    return (
        <Container maxWidth="lg" className={classes.teamsContainer}>
            <Grid container justifyContent="space-between">
                <Grid item className={classes.pageTitle}>
                    Équipes
                </Grid>
                <Grid item className={classes.buttonContainer}>
                    <Button className={classes.createButton} onClick={handleNewTeam}>
                        <AddIcon className={classes.icon} />Créer une équipe
                    </Button>
                </Grid>
                <Grid container spacing={2}>
                    {teamItems && teamItems.map((item, i) => (
                        <CardComponent
                            key={i}
                            item={item}
                            handleClickOpen={handleClickOpen}
                        />
                    ))}
                </Grid>
            </Grid>
            <TeamsModal
                open={open}
                handleClose={handleClose}
                teamItem={currentItem}
                onSubmitRefresh={() => {
                    setRefreshPage((p) => p + 1);
                }}
            />
        </Container>
    );
};

export default Teams;
