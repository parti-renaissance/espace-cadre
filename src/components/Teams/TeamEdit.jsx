import { useState, useEffect } from 'react';
import {
    Container, Grid, makeStyles, createStyles, Paper, Typography,
} from '@material-ui/core';
import {
    useParams,
} from 'react-router-dom';
import { deleteTeamMember, getTeam } from '../../api/teams';
import MemberCard from './MemberCard';

const useStyles = makeStyles((theme) => createStyles({
    root: {
        borderRadius: '8.35px',
        boxShadow: 'none',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    buttonClasses: {
        color: theme.palette.whiteCorner,
        background: theme.palette.blue600,
        '&:hover': {
            background: theme.palette.blue800,
        },
    },
    teamsContainer: {
        marginBottom: theme.spacing(2),
    },
    pageTitle: {
        fontSize: '24px',
        fontWeight: '400',
        color: theme.palette.cyan800,
        marginBottom: theme.spacing(2),
    },
    title: {
        fontSize: '18px',
        fontWeight: '400',
        color: theme.palette.gray800,
    },
    noMember: {
        padding: theme.spacing(1, 2),
        borderRadius: '8.35px',
    },
}));

const TeamEdit = () => {
    const classes = useStyles();
    const { teamId } = useParams();
    const [team, setTeam] = useState(null);

    useEffect(() => {
        getTeam(teamId, setTeam);
    }, [teamId]);

    const handleDelete = async (memberId) => {
        await deleteTeamMember(teamId, memberId);
        getTeam(teamId, setTeam);
    };

    return (
        <Container maxWidth="lg" className={classes.teamsContainer}>
            <Grid container>
                <Grid item className={classes.pageTitle}>
                    Équipes &gt; {team?.name}
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} className={classes.title}> Membres de l&apos;équipe </Grid>
                {team?.members.length > 0 ? team?.members?.map(((member) => (
                    <MemberCard
                        key={member.id}
                        member={member}
                        handleDelete={() => handleDelete(member.id)}
                    />
                ))) : (
                    <Grid item>
                        <Paper className={classes.noMember}>
                            <Typography variant="body1">
                                Cette équipe ne contient aucun membre
                            </Typography>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default TeamEdit;
