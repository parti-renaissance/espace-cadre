import React, { useState, useEffect } from 'react';
import {
    Container, makeStyles, createStyles, Grid, Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import TeamCard from './TeamCard';
import TeamModal from './TeamModal';
import { getTeams } from '../../api/teams';

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
    const [teams, setTeams] = useState([]);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [refreshPage, setRefreshPage] = useState(0);
    const [open, setOpen] = useState(false);

    const handleNewTeam = () => {
        setCurrentTeam({
            uuid: null,
            name: '',
        });
        setOpen(true);
    };

    const handleEditTeam = (id) => {
        setCurrentTeam(teams.find((team) => team.uuid === id));
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getTeams(setTeams);
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
                    {teams.map((team) => (
                        <TeamCard
                            key={team.id}
                            team={team}
                            handleEditTeam={handleEditTeam}
                        />
                    ))}
                </Grid>
            </Grid>
            <TeamModal
                open={open}
                handleClose={handleClose}
                teamItem={currentTeam}
                onSubmitRefresh={() => {
                    setRefreshPage((p) => p + 1);
                }}
            />
        </Container>
    );
};

export default Teams;
