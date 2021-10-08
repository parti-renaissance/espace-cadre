import React from 'react';
import {
    Container, Paper, Button, Grid, makeStyles, createStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { PATHS } from '../../../Routes';

const useStyles = makeStyles((theme) => createStyles({
    paperContainer: {
        padding: '16px',
        textAlign: 'center !important',
        borderRadius: '8px',
    },
    elementContainer: {
        textAlign: 'center',
    },
    success: {
        marginBottom: '16px',
    },
    returnButton: {
        color: theme.palette.whiteCorner,
        background: theme.palette.blue600,
        '&:hover': {
            background: theme.palette.blue800,
        },
    },
}));

function Confirmation() {
    const classes = useStyles();

    return (
        <Container>
            <Paper className={classes.paperContainer}>
                <Grid container className={`${classes.elementContainer} ${classes.success}`}>
                    <Grid item xs={12}>
                        Félicitations, votre e-mail a bien été envoyé 🎉
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        <Link to={PATHS.MESSAGERIE.route}>
                            <Button className={classes.returnButton}>
                                Revenir à la messagerie
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default Confirmation;
