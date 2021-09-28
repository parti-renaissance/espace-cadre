/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import {
    Box, Button, Container, Grid, makeStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import StepButton from '../StepButton';
import DynamicFilters from '../../Filters/DynamicFilters';
import { FEATURE_MESSAGES } from '../../Feature/FeatureCode';

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

const Filters = ({ email, previousStepCallback }) => {
    console.log('filters step');

    const [filters, setFilters] = useState({});

    const classes = useStyles();
    console.log(previousStepCallback);
    return (
        <>
            <StepButton
                label="Retour"
                onClick={previousStepCallback}
            />

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
                            // onClick={() => handleSendEmail(true)}
                            // disabled={buttonState && buttonState.state !== 'confirme'}
                        >
                            M&apos;envoyer un message test
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            size="medium"
                            className={classes.sendButton}
                            // onClick={() => handleSendEmail()}
                            // disabled={buttonState && buttonState.state !== 'confirme' && email && (!email.recipient_count || email.recipient_count < 1)}
                        >
                            <Box>
                                <i className={`fa fa-paper-plane-o ${classes.buttonIcon}`} />
                            </Box>
                            Envoyer l&apos;email
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default Filters;

Filters.propTypes = {
    email: PropTypes.arrayOf(Object).isRequired,
    previousStepCallback: PropTypes.func,
};
