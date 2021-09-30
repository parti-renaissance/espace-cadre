/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import {
    Box, Button, Container, Grid, makeStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import StepButton from '../StepButton';
import DynamicFilters from '../../Filters/DynamicFilters';
import { FEATURE_MESSAGES } from '../../Feature/FeatureCode';
import { apiClient } from '../../../services/networking/client';
import { useUserScope } from '../../../redux/user/hooks';
import useRetry from '../../Filters/useRetry';
import Loader from '../../Loader';
import SendButton from '../SendButton';
import ErrorComponent from '../../ErrorComponent';

const useStyles = makeStyles((theme) => ({
    container: {
        textAlign: 'center',
    },
    pageTitle: {
        fontSize: '24px',
        fontWeight: '400',
        color: theme.palette.blue600,
        marginBottom: '16px',
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
    success: {
        color: `${theme.palette.successButton} !important`,
        background: `${theme.palette.whiteCorner} !important`,
    },
    buttonIcon: {
        marginRight: '8px',
    },
}));

const BUTTON_INITIAL_STATE = { state: 'readyToSend', isLoading: false };
const duration = 1000;
const count = 10;

const Filters = ({ previousStepCallback, email }) => {
    const classes = useStyles();
    const [currentScope] = useUserScope();
    const [audienceId, setAudienceId] = useState(null);
    const [errorMessage, setErrorMessage] = useState();
    const [loadingTestButton, setLoadingTestButton] = useState(false);
    const [loadingSendButton, setLoadingSendButton] = useState(BUTTON_INITIAL_STATE);
    const [, audienceSegment, launch] = useRetry(async (uuid) => {
        const result = await apiClient.get(`/v3/audience-segments/${uuid}`);
        return result;
    }, duration, count);

    const handleFiltersSubmit = async (filtersToSend) => {
        try {
            if (audienceId) {
                await apiClient.put(`/v3/audience-segments/${audienceId}`, { filter: { ...{ scope: currentScope.code }, ...filtersToSend } });
                launch(audienceId);
            } else {
                const audience = await apiClient.post('/v3/audience-segments', { filter: { ...{ scope: currentScope.code }, ...filtersToSend } });
                setAudienceId(audience.uuid);
                launch(audience.uuid);
            }
        } catch (error) {
            setErrorMessage(error);
        }
    };

    const handleSendEmail = async (test = false) => {
        if (test) {
            setLoadingTestButton(true);
            const responseTest = await apiClient.post(`/v3/adherent_messages/${email.uuid}/send-test`);
            if (responseTest === 'OK') {
                setLoadingTestButton(false);
            }
            return;
        }

        setLoadingSendButton((state) => ({ ...state, isLoading: true }));
        const responseSend = await apiClient.post(`/v3/adherent_messages/${email.uuid}/send`);

        if (responseSend === 'OK') {
            setLoadingSendButton(() => ({ state: 'success', isLoading: false }));
        } else {
            setLoadingSendButton(() => ({ state: 'error', isLoading: false }));
        }
    };

    return (
        <>
            <Container maxWidth="xl">
                <Box className={classes.pageTitle}>Messagerie &gt; Filtrer mon message</Box>
                <StepButton
                    label="Retour"
                    onClick={previousStepCallback}
                />
                { errorMessage && (
                    <ErrorComponent errorMessage={errorMessage} />
                )}
                <Grid container spacing={2} className={classes.container}>
                    <Grid item>
                        <DynamicFilters
                            feature={FEATURE_MESSAGES}
                            onSubmit={(newFilters) => {
                                handleFiltersSubmit(newFilters);
                            }}
                            onReset={() => {}}
                        />
                    </Grid>
                    {audienceSegment && (
                        <Grid item xs={12} className={classes.addresseesContainer}>
                            Vous allez envoyer un message à <span className={classes.addresseesCount}>{audienceSegment.recipient_count || 0} </span> contact{audienceSegment.recipient_count > 1 && 's'}
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            size="medium"
                            className={classes.sendTestButton}
                            onClick={() => {
                                setLoadingTestButton(true);
                                handleSendEmail(true);
                            }}
                            disabled={!audienceSegment?.synchronized || audienceSegment?.recipient_count < 1}
                        >
                            <Box className={classes.buttonIcon}>
                                {loadingTestButton && <Loader />}
                            </Box>
                            M&apos;envoyer un message test
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <SendButton
                            loadingSendButton={loadingSendButton}
                            audienceSegment={audienceSegment}
                            handleSendEmail={handleSendEmail}
                        />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default Filters;

Filters.propTypes = {
    previousStepCallback: PropTypes.func,
    email: PropTypes.objectOf(Object).isRequired,
};
