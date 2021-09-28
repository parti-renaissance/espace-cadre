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
import Loader from '../../Loader';
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

const Filters = ({ previousStepCallback }) => {
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
                    <Grid item xs={12} className={classes.addresseesContainer}>
                        Vous allez envoyer un message à {loading ? <Loader /> : <span className={classes.addresseesCount}>{audienceSegment?.recipient_count || 0} </span>} contact{audienceSegment?.recipient_count > 1 && 's'}
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
    previousStepCallback: PropTypes.func,
};
