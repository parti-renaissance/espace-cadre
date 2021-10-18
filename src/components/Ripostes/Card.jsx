/* eslint-disable react/forbid-prop-types */
import React from 'react';
import {
    makeStyles, createStyles, Grid, Paper, Button, Box,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import DotMenu from '../HelperComponents/DotMenu';

const useStyles = makeStyles((theme) => createStyles({
    root: {
        padding: '16px',
        borderRadius: '8.35px',
    },
    container: {
        marginBottom: '8px',
    },
    lastContainer: {
        marginBottom: '30px',
    },
    label: {
        fontSize: '12px',
        borderRadius: '8.35px',
        padding: '2px 8px',
    },
    active: {
        color: theme.palette.green700,
        background: theme.palette.activeLabel,
    },
    inactive: {
        color: theme.palette.red600,
        background: theme.palette.inactiveLabel,
    },
    date: {
        fontSize: '12px',
        color: theme.palette.gray600,
        padding: '5px 8px',

    },
    editButton: {
        fontSize: '13px',
        color: theme.palette.indigo700,
        marginTop: '11px',
    },
    riposteKpi: {
        border: `1px solid ${theme.palette.gray200}`,
        borderRadius: '20px',
        padding: '4px 12px',
    },
}));

const Card = ({
    item, handleClickOpen, handleActiveItem,
}) => {
    const classes = useStyles();

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Paper classes={{ root: classes.root }}>
                <Grid container className={classes.container}>
                    <Grid item>{item.enabled ? <span className={`${classes.active} ${classes.label}`}>Active</span> : <span className={`${classes.inactive} ${classes.label}`}>Inactive</span>}</Grid>
                    <Grid item className={classes.date}>Le {new Date(item.created_at).toLocaleDateString()}</Grid>
                </Grid>
                <Grid container className={classes.container}>
                    <Grid item>{item.title}</Grid>
                </Grid>
                <Grid container spacing={1} className={`${classes.container}, ${classes.lastContainer}`}>
                    <Grid item>
                        {item.with_notification ? <Box className={classes.riposteKpi}><i className="fas fa-bell" /></Box> : <Box className={classes.riposteKpi}><i className="fas fa-bell-slash" /></Box>}
                    </Grid>
                    <Grid item>
                        <Box className={classes.riposteKpi}>{item.nb_ripostes} riposte{item.nb_ripostes > 1 && 's'}</Box>
                    </Grid>
                    <Grid item>
                        <Box className={classes.riposteKpi}>{item.nb_source_views} affichage{item.nb_source_views > 1 && 's'} de la source</Box>
                    </Grid>
                    <Grid item>
                        <Box className={classes.riposteKpi}>{item.nb_views} vue{item.nb_views > 1 && 's'}</Box>
                    </Grid>
                    <Grid item>
                        <Box className={classes.riposteKpi}>{item.nb_detail_views} détail{item.nb_detail_views > 1 && 's'}</Box>
                    </Grid>
                </Grid>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Button
                            className={classes.editButton}
                            onClick={() => handleClickOpen(item.uuid)}
                        >Éditer
                        </Button>
                    </Grid>
                    <Grid item>
                        <DotMenu handleActiveItem={handleActiveItem} item={item} />
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
};

export default Card;

Card.propTypes = {
    item: PropTypes.object.isRequired,
    handleClickOpen: PropTypes.func.isRequired,
    handleActiveItem: PropTypes.func.isRequired,
};
