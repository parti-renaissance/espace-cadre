import React, { useState, useEffect } from 'react';
import {
    Container, Grid, makeStyles, createStyles, Card,
} from '@material-ui/core';
import {
    useParams,
} from 'react-router-dom';
import ClearIcon from '@material-ui/icons/Clear';
import { apiClient } from '../../services/networking/client';

const useStyles = makeStyles((theme) => createStyles({
    teamsContainer: {
        marginBottom: '16px',
    },
    pageTitle: {
        fontSize: '24px',
        fontWeight: '400',
        color: theme.palette.gray800,
        marginBottom: '16px',
    },
    root: {
        padding: '16px',
        borderRadius: '8.35px',
        elevation: 0,
    },
}));

function TeamsEdit() {
    const classes = useStyles();
    const params = useParams();
    const [team, setTeam] = useState();

    useEffect(() => {
        const getTeam = async () => {
            const teamData = await apiClient.get(`api/v3/teams/${params.teamId}`);
            setTeam(teamData);
        };

        getTeam();
    }, [params]);

    useEffect(() => {
        console.log(team);
    }, [team]);

    return (
        <Container maxWidth="lg" className={classes.teamsContainer}>
            <Grid container justifyContent="space-between">
                <Grid item className={classes.pageTitle}>
                    Équipes &gt; {team?.name}
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="space-between">
                {team?.members?.map(((member) => (
                    <Card classes={{ root: classes.root }} key={member.uuid}>
                        <Grid container justifyContent="space-between">
                            <Grid item>{member.first_name} {member.last_name}</Grid>
                            <Grid item><ClearIcon /></Grid>
                        </Grid>
                    </Card>
                )))}
            </Grid>
        </Container>
    );
}

export default TeamsEdit;
