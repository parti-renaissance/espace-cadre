import React from 'react';
import {
    Box, Button, createStyles, Grid, makeStyles,
} from '@material-ui/core';
import Loader from '../Loader';

const useStyles = makeStyles((theme) => createStyles({
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
        <Grid container spacing={2}>
            <Grid item sm={2}>
                <Box>
                    <Button
                        className={classes.materialButton}
                        onClick={disabled ? null : onClick}
                        disabled={disabled}
                        size="large"
                    >
                        <Box className={classes.buttonIcon}>
                            {loading ? <Loader /> : <i className="fa fa-paper-plane-o" />}
                        </Box>
                        {label}
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
};

export default StepButton;
