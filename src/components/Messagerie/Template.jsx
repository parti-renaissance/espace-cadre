import React, { useState } from 'react';
import {
    Grid, Box, createStyles, makeStyles, TextField,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useUserScope } from '../../redux/user/hooks';
import Editor from './Component/Editor';
import StepButton from './Component/StepButton';
import { useMessageSubject, useMessageTemplate, useRemoteMessage } from '../../redux/messagerie/hooks';
import { apiClient } from '../../services/networking/client';
import { clearBody } from './utils';
import TemplateSelect from './Component/TemplateSelect';
import PATHS from '../../paths';

const useStyles = makeStyles((theme) => createStyles({
    pageTitle: {
        fontSize: '24px',
        fontWeight: '400',
        color: theme.palette.blue600,
        marginBottom: '16px',
    },
    objectContainer: {
        background: theme.palette.whiteCorner,
        padding: '16px',
        borderRadius: '12px 12px 0 0',
    },
    mailObject: {
        width: '100%',
        border: `1px solid ${theme.palette.gray200}`,
        borderRadius: '8.35px',
    },
    buttonContainer: {
        justifyContent: 'spaceBetween',
        marginRight: '16px',
    },
    templateContainer: {
        marginRight: '16px',
    },
}));

const Template = () => {
    const [messageSubject, setMessageSubject] = useMessageSubject();
    const [messageTemplate] = useMessageTemplate();
    const [remoteMessage, setRemoteMessage] = useRemoteMessage();

    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [currentScope] = useUserScope();
    const classes = useStyles();

    const editEmail = async () => {
        const body = {
            type: currentScope.code,
            label: `DataCorner: ${messageSubject}`,
            subject: messageSubject,
            content: clearBody(messageTemplate.chunks.body),
        };

        if (remoteMessage?.uuid) {
            const message = await apiClient.put(`/v3/adherent_messages/${remoteMessage.uuid}`, body);

            return message;
        }

        const message = await apiClient.post('/v3/adherent_messages', body);
        return message;
    };

    return (
        <>
            <Box className={classes.pageTitle}>Messagerie &gt; Créer un message</Box>
            <Grid container className={classes.objectContainer}>
                <Grid item xs={4} className={classes.buttonContainer}>
                    <TextField
                        size="small"
                        label="Objet du mail"
                        variant="outlined"
                        className={classes.mailObject}
                        defaultValue={messageSubject}
                        onChange={(event) => setMessageSubject(event.target.value)}
                    />
                </Grid>
                <Grid item xs={5} className={classes.templateContainer}>
                    <TemplateSelect />
                </Grid>
                <Grid item xs>
                    <StepButton
                        label="Suivant"
                        loading={loading}
                        disabled={loading || !messageSubject || !messageTemplate}
                        onClick={() => {
                            setLoading(true);
                            editEmail().then((body) => {
                                setRemoteMessage(body);
                                history.push(PATHS.MESSAGERIE_FILTER.url(body.uuid));
                            });
                        }}
                    />
                </Grid>
            </Grid>

            <Editor />
        </>
    );
};

export default Template;
