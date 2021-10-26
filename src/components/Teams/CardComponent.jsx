/* eslint-disable react/forbid-prop-types */
import React from 'react';
import {
    makeStyles, createStyles, Grid, Paper, Button,
} from '@material-ui/core';
import { Link, generatePath } from 'react-router-dom';
import PropTypes from 'prop-types';
import PATHS from '../../paths';

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

const CardComponent = ({
    item,
}) => {
    const classes = useStyles();

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Paper classes={{ root: classes.root }}>
                <Grid container className={classes.container}>
                    <Grid item>
                        <span className={classes.chip}>{item.members_count} membres</span>
                    </Grid>
                </Grid>
                <Grid container className={classes.container}>
                    <Grid item className={classes.title} title={item.name}>{item.name}</Grid>
                    <Grid item className={classes.creator}>Par {item.creator}</Grid>
                </Grid>
                <Grid container className={classes.buttonContainer}>
                    <Grid item>
                        <Link to={generatePath(PATHS.TEAMS_EDIT.route, { teamId: item.uuid })}>
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

export default CardComponent;

CardComponent.propTypes = {
    item: PropTypes.object.isRequired,
};
