/* eslint-disable react/forbid-prop-types */
import React from 'react';
import {
    makeStyles, createStyles, Grid, Paper, Button,
} from '@material-ui/core';
import { Link, generatePath } from 'react-router-dom';
import PATHS from '../../paths';
import { Team } from '../../domain/team';

const useStyles = makeStyles((theme) => createStyles({
    root: {
        padding: '16px',
        borderRadius: '8.35px',
    },
    container: {
        marginBottom: '8px',
    },
    chip: {
        fontSize: '10px',
        fontWeight: '500',
        color: theme.palette.gray700,
        background: 'rgba(55, 65, 81, 0.08)',
        padding: '2px 8px',
        borderRadius: '19px',
    },
    title: {
        fontSize: '16px',
        fontWeight: '600',
        color: theme.palette.gray900,
        width: '400px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    creator: {
        fontSize: '12px',
        fontWeight: '400',
        color: theme.palette.gray600,
    },
    editButton: {
        fontSize: '13px',
        fontWeight: '500',
        color: theme.palette.lightBlue600,
        marginTop: '11px',
        '&:hover': {
            background: theme.palette.teamBackground,
            borderRadius: '8.35px',
        },
    },
}));

const TeamCard = ({
    team,
}) => {
    const classes = useStyles();

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Paper classes={{ root: classes.root }}>
                <Grid container className={classes.container}>
                    <Grid item>
                        <span className={classes.chip}>{team.members_count} membres</span>
                    </Grid>
                </Grid>
                <Grid container className={classes.container}>
                    <Grid item className={classes.title} title={team.name}>{team.name}</Grid>
                    <Grid item className={classes.creator}>Par {team.creator}</Grid>
                </Grid>
                <Grid container className={classes.buttonContainer}>
                    <Grid item>
                        <Link to={generatePath(PATHS.TEAMS_EDIT.route, { teamId: team.uuid })}>
                            <Button
                                className={classes.editButton}
                            >
                                Voir
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
};

export default TeamCard;

TeamCard.propTypes = {
    team: Team.propTypes.isRequired,
};
