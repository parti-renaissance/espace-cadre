/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import {
    makeStyles, createStyles, Dialog, Box, Grid, Button, FormControlLabel, Checkbox,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert } from '@material-ui/lab';
import { apiClient } from '../../services/networking/client';
import ModalField from './ModalField';

const useStyles = makeStyles((theme) => createStyles({
    paper: {
        padding: '32px',
        width: '664px',
        borderRadius: '12px',
    },
    innerContainer: {
        marginBottom: '16px',
    },
    modalTitle: {
        fontSize: '24px',
        color: theme.palette.gray800,
        fontWeight: '400',
    },
    cross: {
        color: theme.palette.gray700,
        marginTop: '30px',
        cursor: 'pointer',
    },
    textField: {
        border: `1px solid ${theme.palette.gray200}`,
        borderRadius: '8.35px',
        margin: '8px 0',
    },
    textArea: {
        border: `1px solid ${theme.palette.gray200}`,
        width: '100%',
        borderRadius: '8px',
    },
    modalButton: {
        border: `1px solid ${theme.palette.gray200}`,
        borderRadius: '8.35px',
        background: theme.palette.blueCorner,
        color: theme.palette.whiteCorner,
        '&:disabled': {
            color: theme.palette.blackCorner,
            background: theme.palette.gray200,
        },
        '&:hover': {
            background: theme.palette.blueCornerHover,
        },
    },
}));

const riposteSchema = Yup.object({
    title: Yup.string()
        .min(1, 'Minimum 1 charactère')
        .max(255, 'Maximum 255 charactères')
        .required('Titre obligatoire'),
    body: Yup.string()
        .min(1, 'Minimum 1 charactère')
        .required('Texte obligatoire'),
    source_url: Yup.string()
        .url('Ce champ doit être une URL valide')
        .required('Url obligatoire'),
});

const Modal = ({
    handleClose, riposteItem, onSubmitRefresh, open,
}) => {
    const classes = useStyles();
    const [errorMessage, setErrorMessage] = useState();

    const formik = useFormik({
        initialValues: {
            title: riposteItem?.title,
            body: riposteItem?.body,
            source_url: riposteItem?.source_url,
            with_notification: riposteItem?.with_notification,
            enabled: riposteItem?.enabled,
        },
        validationSchema: riposteSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                if (riposteItem.uuid) {
                    await apiClient.put(`api/v3/ripostes/${riposteItem.uuid}`, values);
                } else {
                    await apiClient.post('api/v3/ripostes', values);
                }

                onSubmitRefresh();
                handleClose();
            } catch (error) {
                setErrorMessage(error);
            }
        },
    });
    return (
        <Dialog open={open} onClose={handleClose} classes={{ paper: classes.paper }}>
            <form onSubmit={formik.handleSubmit}>
                <Grid container justifyContent="space-between" className={classes.innerContainer}>
                    <Grid item>
                        <Box component="span" className={classes.modalTitle}>Créer ou modifier une riposte</Box>
                    </Grid>
                    <Grid item>
                        <Box component="span" className={classes.cross} onClick={handleClose}>X</Box>
                    </Grid>
                </Grid>
                <Grid container>
                    {errorMessage && <Alert severity="error" message={errorMessage} />}
                </Grid>
                <Grid container className={classes.innerContainer}>
                    <Grid item xs={12}>
                        Titre
                    </Grid>
                    <Grid item xs={12}>
                        <ModalField formik={formik} label="title" />
                    </Grid>
                </Grid>
                <Grid container className={classes.innerContainer}>
                    <Grid item xs={12}>
                        Texte
                    </Grid>
                    <Grid item xs={12}>
                        <ModalField formik={formik} label="body" />
                    </Grid>
                </Grid>
                <Grid container className={classes.innerContainer}>
                    <Grid item xs={12}>
                        URL
                    </Grid>
                    <Grid item xs={12}>
                        <ModalField formik={formik} label="source_url" />
                    </Grid>
                </Grid>
                <Grid container className={classes.innerContainer}>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={(
                                <Checkbox
                                    id="with_notification"
                                    size="small"
                                    color="primary"
                                    checked={formik.values.with_notification}
                                    onChange={formik.handleChange}
                                />
                            )}
                            label="Avec notification"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={(
                                <Checkbox
                                    id="enabled"
                                    color="primary"
                                    size="small"
                                    checked={formik.values.enabled}
                                    onChange={formik.handleChange}
                                />
                            )}
                            label="Active"
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Button
                        type="submit"
                        className={classes.modalButton}
                        fullWidth
                    >
                        Valider
                    </Button>
                </Grid>
            </form>
        </Dialog>
    );
};

export default Modal;

Modal.defaultProps = {
    handleClose: () => {},
    onSubmitRefresh: () => {},
    riposteItem: null,
};

Modal.propTypes = {
    handleClose: PropTypes.func,
    onSubmitRefresh: PropTypes.func,
    riposteItem: PropTypes.object,
    open: PropTypes.bool.isRequired,
};
