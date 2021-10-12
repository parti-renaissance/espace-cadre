import React from 'react';
import {
    makeStyles, createStyles, Grid, Paper, Button,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import RiposteModal from './Modal';

const useStyles = makeStyles((theme) => createStyles({
    root: {
        padding: '16px',
        borderRadius: '8.35px',
    },
    firstLineContainer: {
        marginBottom: '7px',
    },
    secondLineContainer: {
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
    },
}));

const RiposteCard = ({
    ripostesItems, handleClickOpen, handleClose, open,
}) => {
    const classes = useStyles();

    return (
        <>
            <Grid container spacing={2}>
                {ripostesItems && ripostesItems.map((item, i) => (
                    <Grid item key={i} xs={12} sm={4}>
                        <Paper classes={{ root: classes.root }}>
                            <Grid container className={classes.firstLineContainer}>
                                <Grid item>{item.enabled ? <span className={`${classes.active} ${classes.label}`}>Active</span> : <span className={`${classes.inactive} ${classes.label}`}>Inactive</span>}</Grid>
                                <Grid item className={classes.date}>Le {new Date(item.created_at).toLocaleDateString()}</Grid>
                            </Grid>
                            <Grid container className={classes.secondLineContainer}>
                                <Grid item>{item.title}</Grid>
                            </Grid>
                            <Grid container>
                                <Button className={classes.editButton} onClick={handleClickOpen}>Editer</Button>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <RiposteModal open={open} handleClose={handleClose} />
        </>
    );
};

export default RiposteCard;

RiposteCard.defaultProps = {
    ripostesItems: [],
};

RiposteCard.propTypes = {
    ripostesItems: PropTypes.arrayOf(Object),
    handleClickOpen: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};
