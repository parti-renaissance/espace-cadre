/* eslint-disable react/require-default-props */
import React from 'react';
import {
    Box, Button, createStyles, Grid, makeStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Loader from '../Loader';

const useStyles = makeStyles((theme) => createStyles({
    buttonContainer: {
        marginBottom: '8px',
    },
    materialButton: {
        width: '100%',
        color: `${theme.palette.whiteCorner}`,
        backgroundColor: theme.palette.blueCorner,
        '&:hover': {
            background: theme.palette.blueCornerHover,
        },
    },
    buttonIcon: {
        marginRight: '8px',
    },
}));

const StepButton = ({
    disabled, loading, onClick, label,
}) => {
    const classes = useStyles();

    return (
        <Grid container spacing={2} className={classes.buttonContainer}>
            <Grid item sm={3}>
                <Button
                    className={classes.materialButton}
                    onClick={disabled ? null : onClick}
                    disabled={disabled}
                    size="medium"
                >
                    <Box className={classes.buttonIcon}>
                        {loading ? <Loader /> : <i className="fa fa-paper-plane-o" />}
                    </Box>
                    {label}
                </Button>
            </Grid>
        </Grid>
    );
};

export default StepButton;

StepButton.propTypes = {
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
};
