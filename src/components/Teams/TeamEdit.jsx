import React, { useState, useEffect } from 'react';
import {
    Container, Grid, makeStyles, createStyles, Card,
} from '@material-ui/core';
import {
    useParams,
} from 'react-router-dom';
import ClearIcon from '@material-ui/icons/Clear';
import { getTeam } from '../../api/teams';

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
        boxShadow: 'none',
    },
}));

const TeamEdit = () => {
    const classes = useStyles();
    const { teamId } = useParams();
    const [team, setTeam] = useState(null);

    useEffect(() => {
        getTeam(teamId, setTeam);
    }, [teamId]);

    return (
        <Container maxWidth="lg" className={classes.teamsContainer}>
            <Grid container justifyContent="space-between">
                <Grid item className={classes.pageTitle}>
                    Équipes &gt; {team?.name}
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="space-between">
                {team?.members?.map(((member) => (
                    <Card classes={{ root: classes.root }} key={member.id}>
                        <Grid container justifyContent="space-between">
                            <Grid item>{member?.firstname} {member?.lastname}</Grid>
                            <Grid item><ClearIcon /></Grid>
                        </Grid>
                    </Card>
                )))}
            </Grid>
        </Container>
    );
};

export default TeamEdit;
