import React, { useState } from 'react';
import {
    Box, Button, Container, Grid, makeStyles,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link, useHistory, useParams } from 'react-router-dom'
import DynamicFilters from '../Filters/DynamicFilters';
import { useUserScope } from '../../redux/user/hooks';
import useRetry from '../useRetry';
import PATHS from '../../paths';
import ErrorComponent from '../ErrorComponent';
import Loader from '../HelperComponents/Loader';
import ModalComponent from './Component/ModalComponent';
import { FEATURE_MESSAGES } from '../Feature/FeatureCode';
import {
    createSegmentAudience,
    getMessage,
    getSegmentAudience,
    sendMessage, sendTestMessage, setMessageSegment,
    updateSegmentAudience,
} from '../../api/messagerie'

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
    messageContainer: {
        fontWeight: '600',
        fontSize: '18px',
        color: theme.palette.gray700,
        marginBottom: '24px',
    },
    message: {
        height: '30px',
    },
    addresseesCount: {
        color: theme.palette.blue800,
    },
    sendTestButton: {
        color: theme.palette.blue600,
        borderColor: theme.palette.blue600,
        '&:hover': {
            background: theme.palette.gray200,
        },
    },
    sendButton: {
        color: theme.palette.whiteCorner,
        background: theme.palette.blue600,
        '&:hover': {
            background: theme.palette.blue800,
        },
    },
    success: {
        color: `${theme.palette.successButton} !important`,
        background: `${theme.palette.whiteCorner} !important`,
    },
    backButton: {
        color: theme.palette.blue600,
    },
    buttonIcon: {
        marginRight: '8px',
    },
}));

const duration = 1000;
const count = 10;

const Filters = () => {
    const { messageUuid } = useParams();
    const history = useHistory();
    const classes = useStyles();
    const [currentScope] = useUserScope();
    const [audienceId, setAudienceId] = useState(null);
    const [errorMessage, setErrorMessage] = useState();
    const [loadingTestButton, setLoadingTestButton] = useState(false);
    const [open, setOpen] = useState(false);
    const [loadingSegment, audienceSegment, launch] = useRetry(getSegmentAudience, duration, count);
    const [loadingSendButton,, launchAreFilterSaved] = useRetry(
        getMessage,
        duration,
        count,
        async () => {
            const responseSend = await sendMessage(messageUuid);
            if (responseSend === 'OK') {
                history.push(PATHS.MESSAGERIE_CONFIRMATION.route);
            } else {
                // TODO: error management
            }
        },
    );

    const handleFiltersSubmit = async (filtersToSend) => {
        try {
            if (audienceId) {
                await updateSegmentAudience(audienceId, { filter: { ...{ scope: currentScope.code }, ...filtersToSend } });
                launch(audienceId);
            } else {
                const audience = createSegmentAudience({ filter: { ...{ scope: currentScope.code }, ...filtersToSend } });
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
            const responseTest = await sendTestMessage(messageUuid)
            if (responseTest === 'OK') {
                setLoadingTestButton(false);
            }
        } else {
            await setMessageSegment(messageUuid, audienceId)
            launchAreFilterSaved()
        }
    };

    return (
        <>
            <Container maxWidth="xl">
                <Box className={classes.pageTitle}>Messagerie &gt; Filtrer mon message</Box>
                <Grid container>
                    <Link to={PATHS.MESSAGERIE_EDIT.url(messageUuid)}>
                        <Button
                            type="button"
                            disableRipple
                            className={classes.backButton}
                            size="medium"
                            startIcon={<ArrowBackIcon className={classes.buttonIcon} />}
                        >Précédent
                        </Button>
                    </Link>
                </Grid>
                <Grid container>
                    { errorMessage && (
                        <ErrorComponent errorMessage={errorMessage} />
                    )}
                </Grid>
                <Grid container spacing={2} className={classes.container}>
                    <Grid item>
                        <DynamicFilters
                            feature={FEATURE_MESSAGES}
                            onSubmit={handleFiltersSubmit}
                        />
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} className={classes.messageContainer}>
                            {audienceSegment && (
                                <div className={classes.message}>Vous allez envoyer un message à <span className={classes.addresseesCount}>{audienceSegment.recipient_count || 0} </span> contact{audienceSegment.recipient_count > 1 && 's'}</div>
                            )}
                            {loadingSegment && (
                                <Loader />
                            )}
                        </Grid>
                    </Grid>
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
                        <Button
                            variant="outlined"
                            size="medium"
                            className={classes.sendButton}
                            disabled={!audienceSegment?.synchronized || audienceSegment?.recipient_count < 1 || loadingSendButton}
                            onClick={() => setOpen(true)}
                        >
                            <Box>
                                {loadingSendButton ? <Loader /> : <i className={`fa fa-paper-plane-o ${classes.buttonIcon}`} />}
                            </Box>
                            Envoyer l&apos;email
                        </Button>
                        {open && (
                            <ModalComponent
                                open={open}
                                recipientCount={audienceSegment?.recipient_count || 0}
                                handleClose={() => setOpen(false)}
                                handleSendEmail={handleSendEmail}
                            />
                        )}
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default Filters;
