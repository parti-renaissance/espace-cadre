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

const Filters = ({ previousStepCallback, email }) => {
    // const [filters, setFilters] = useState({});
    const classes = useStyles();
    const [currentScope] = useUserScope();
    const [audienceId, setAudienceId] = useState(null);
    const [loading, audienceSegment, go] = useRetry(async (uuid) => {
        const result = await apiClient.get(`/v3/audience-segments/${uuid}`);
        return result;
    }, 1000, 10);

    const handleSubmit = async (filtersToSend) => {
        try {
            if (audienceId) {
                await apiClient.put(`/v3/audience-segments/${audienceId}`, { filter: { ...{ scope: currentScope.code }, ...filtersToSend } });
                go(audienceId);
            } else {
                const audience = await apiClient.post('/v3/audience-segments', { filter: { ...{ scope: currentScope.code }, ...filtersToSend } });
                setAudienceId(audience.uuid);
                go(audience.uuid);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSendEmail = async (test = false) => {
        if (test) {
            await apiClient.post(`/v3/adherent_messages/${email.uuid}/send-test`);

            return;
        }

        if (!audienceSegment.synchronized || audienceSegment.recipient_count < 1) {
            throw new Error('Send not allowed');
        }

        /* setButtonState((state) => ({ ...state, ...{ isLoading: true } }));

        const response = await apiClient.post(`/v3/adherent_messages/${audienceId}/send`);

        setEmail((state) => ({ ...state, ...{ synchronized: false } }));

        if (response === 'OK') {
            setButtonState((state) => ({ ...state, ...{ state: 'success', isLoading: false } }));
        } else {
            setButtonState((state) => ({ ...state, ...{ state: 'error', isLoading: false } }));
        } */
    };

    return (
        <>
            <Container maxWidth="xl">
                <StepButton
                    label="Retour"
                    onClick={previousStepCallback}
                />
                <Grid container spacing={2} className={classes.container}>
                    <Grid item>
                        <DynamicFilters
                            feature={FEATURE_MESSAGES}
                            // values={filters}
                            onSubmit={(newFilters) => {
                                // setFilters(newFilters);
                                handleSubmit(newFilters);
                            }}
                            onReset={() => {}}
                        />
                    </Grid>
                    {audienceSegment && <Grid item xs={12} className={classes.addresseesContainer}>
                        Vous allez envoyer un message à <span className={classes.addresseesCount}>{audienceSegment?.recipient_count || 0} </span> contact{audienceSegment?.recipient_count > 1 && 's'}
                    </Grid>}
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            size="medium"
                            className={classes.sendTestButton}
                            onClick={() => handleSendEmail(true)}
                            disabled={!audienceSegment?.synchronized || audienceSegment?.recipient_count < 1}
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
                            disabled={!audienceSegment?.synchronized || audienceSegment?.recipient_count < 1}
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
    previousStepCallback: PropTypes.func,
    email: PropTypes.objectOf(Object).isRequired,
};
