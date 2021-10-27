import React, { useState, useEffect } from 'react';
import {
    Container, makeStyles, createStyles, Grid, Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { apiClient } from '../../services/networking/client';
import TeamCard from './TeamCard';
import TeamModal from './TeamModal';

const useStyles = makeStyles((theme) => createStyles({
    teamsContainer: {
        marginBottom: theme.spacing(2),
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
        marginRight: theme.spacing(1),
    },
    createButton: {
        color: theme.palette.lightBlue700,
        padding: theme.spacing(0.75, 1),
    },
    root: {
        padding: theme.spacing(2),
        borderRadius: '8.35px',
    },
}));

const Teams = () => {
    const classes = useStyles();
    const [teamsList, setTeamsList] = useState();
    const [currentItem, setCurrentItem] = useState(null);
    const [refreshPage, setRefreshPage] = useState(0);
    const [open, setOpen] = useState(false);

    const handleNewTeam = () => {
        setCurrentItem({
            uuid: null,
            name: '',
        });
        setOpen(true);
    };

    const handleEditTeam = (id) => {
        setCurrentItem(teamsList.find((el) => el.uuid === id) || null);
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
                    {teamsList && teamsList.map((team, i) => (
                        <TeamCard
                            key={i}
                            team={team}
                            handleEditTeam={() => handleEditTeam(team.uuid)}
                        />
                    ))}
                </Grid>
            </Grid>
            <TeamModal
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
