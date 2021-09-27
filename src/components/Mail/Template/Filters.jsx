/* eslint-disable react/require-default-props */
import React, { useState, useEffect } from 'react';
import {
    Container, Grid, Button, makeStyles, Box,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import DynamicFilters from '../../Filters/DynamicFilters';
import { FEATURE_MESSAGES } from '../../Feature/FeatureCode';
import Loader from '../../Loader';

const useStyles = makeStyles((theme) => ({
    container: {
        textAlign: 'center',
    },
    addresseesContainer: {
        fontWeight: '600',
        fontSize: '18px',
        color: theme.palette.gray700,
        marginBottom: '32px',
    },
    addresseesCount: {
        color: theme.palette.blueCorner,
    },
    sendTestButton: {
        color: theme.palette.blue600,
        borderColor: theme.palette.blue600,
    },
    sendButton: {
        color: theme.palette.whiteCorner,
        background: theme.palette.blue600,
    },
    buttonIcon: {
        marginRight: '8px',
    },
}));

const Filters = ({ buttonState, email, handleSendEmail }) => {
    const [filters, setFilters] = useState({});
    const classes = useStyles();
    // let sendButton;

    /* if (buttonState && buttonState.state === 'success') {
        sendButton = (
            <Button
                type="button"
                size="large"
                disabled
                className={classes.successButton}
            >
                <Box component="span" className={classes.buttonIcon}>
                    <i className="fa fa-check" />
                </Box>
                E-mail envoyé 🎉
            </Button>
        );
    } else if (buttonState && buttonState.state === 'error') {
        sendButton = (
            <Button
                type="button"
                size="large"
                disabled
                className={classes.errorButton}
            >
                <Box component="span" className={classes.buttonIcon}>
                    <i className="fa fa-bomb" />
                </Box>
                Une erreur est survenue
            </Button>
        );
    } */

    useEffect(() => {
        console.log(email && email.recipient_count);
        console.log(handleSendEmail && handleSendEmail);
    }, []);

    return (
        <Container maxWidth="xl">
            <Grid container spacing={2} className={classes.container}>
                <Grid item>
                    <DynamicFilters
                        feature={FEATURE_MESSAGES}
                        values={filters}
                        onSubmit={(newFilters) => setFilters({ ...newFilters })}
                        onReset={() => { setFilters({}); }}
                    />
                </Grid>
                <Grid item xs={12} className={classes.addresseesContainer}>
                    Vous allez envoyer un message à <span className={classes.addresseesCount}>{email && email.recipient_count} </span> contact{email && email.recipient_count > 1 && 's'}
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        size="medium"
                        className={classes.sendTestButton}
                        onClick={() => handleSendEmail(true)}
                        disabled={buttonState && buttonState.state !== 'confirme'}
                    >
                        M&apos;envoyer un message test
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        size="medium"
                        className={classes.sendButton}
                        onClick={() => handleSendEmail()}
                        disabled={buttonState && buttonState.state !== 'confirme' && email && (!email.recipient_count || email.recipient_count < 1)}
                    >
                        <Box>
                            {buttonState && buttonState.isLoading ? <Loader /> : <i className={`fa fa-paper-plane-o ${classes.buttonIcon}`} />}
                        </Box>
                        Envoyer l&apos;email
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Filters;

Filters.propTypes = {
    buttonState: PropTypes.objectOf(Object),
    email: PropTypes.objectOf(Object),
    handleSendEmail: PropTypes.func,
};
