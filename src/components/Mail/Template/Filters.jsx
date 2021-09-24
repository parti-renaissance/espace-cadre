import React, { useState } from 'react';
import {
    Container, Grid, Button, makeStyles, Box,
} from '@material-ui/core';
import DynamicFilters from '../../Filters/DynamicFilters';
import { FEATURE_MESSAGES } from '../../Feature/FeatureCode';
import { apiClient } from '../../../services/networking/client';
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

const BUTTON_INITIAL_STATE = { state: 'send', isLoading: false, inputError: false };
const EMAIL_INITIAL_STATE = { synchronized: false };

const Filters = () => {
    const [filters, setFilters] = useState({});
    const classes = useStyles();
    const [buttonState, setButtonState] = useState(BUTTON_INITIAL_STATE);
    const [email, setEmail] = useState(EMAIL_INITIAL_STATE);

    const handleSendEmail = async (test = false) => {
        if (test) {
            await apiClient.post(`/v3/adherent_messages/${email.uuid}/send-test`);

            return;
        }

        if (!email.synchronized || email.recipient_count < 1) {
            throw new Error('Send not allowed');
        }

        setButtonState((state) => ({ ...state, ...{ isLoading: true } }));

        const response = await apiClient.post(`/v3/adherent_messages/${email.uuid}/send`);

        setEmail((state) => ({ ...state, ...{ synchronized: false } }));

        if (response === 'OK') {
            setButtonState((state) => ({ ...state, ...{ state: 'success', isLoading: false } }));
        } else {
            setButtonState((state) => ({ ...state, ...{ state: 'error', isLoading: false } }));
        }
    };

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
                    Vous allez envoyer un message à <span className={classes.addresseesCount}>{email.recipient_count} XXX contact{email.recipient_count > 1 && 's'}</span> contacts
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        size="medium"
                        className={classes.sendTestButton}
                        onClick={() => handleSendEmail(true)}
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
                        disabled={!email.recipient_count || email.recipient_count < 1}
                    >
                        <Box>
                            {buttonState.isLoading ? <Loader /> : <i className={`fa fa-paper-plane-o ${classes.buttonIcon}`} />}
                        </Box>
                        Envoyer l&apos;email
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Filters;
