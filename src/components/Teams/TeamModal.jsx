/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import {
    makeStyles, createStyles, Dialog, Grid, Button,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ClearIcon from '@material-ui/icons/Clear';
import { apiClient } from '../../services/networking/client';
import AlertBanner from '../HelperComponents/AlertBanner';
import TextFieldComponent from '../HelperComponents/TextFieldComponent';

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
    charactersLimit: {
        fontSize: '10px',
        color: theme.palette.gray300,
    },
    fieldTitle: {
        fontWeight: '600',
    },
    textField: {
        border: `1px solid ${theme.palette.gray200}`,
        borderRadius: '8.35px',
        margin: '8px 0',
    },
    modalButton: {
        color: theme.palette.whiteCorner,
        background: theme.palette.cyan600,
        border: 'none',
        borderRadius: '8.35px',
        '&:hover': {
            backgroundColor: theme.palette.cyan700,
        },
    },
}));

const teamSchema = Yup.object({
    name: Yup.string()
        .min(1, 'Minimum 1 charactère')
        .max(255, 'Maximum 255 charactères')
        .required('Titre obligatoire'),
});

const TeamModal = ({
    handleClose, teamItem, onSubmitRefresh, open,
}) => {
    const classes = useStyles();
    const [errorMessage, setErrorMessage] = useState();

    const formik = useFormik({
        initialValues: {
            name: teamItem?.name,
        },
        validationSchema: teamSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                if (teamItem.id) {
                    await apiClient.put(`api/v3/teams/${teamItem.id}`, values);
                } else {
                    await apiClient.post('api/v3/teams', values);
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
                        <span className={classes.modalTitle}>Créer ou modifier une équipe</span>
                    </Grid>
                    <Grid item>
                        <Button type="button" onClick={handleClose}>
                            <ClearIcon />
                        </Button>
                    </Grid>
                </Grid>
                <Grid container className={classes.innerContainer}>
                    <Grid item xs={12}>
                        {errorMessage && <AlertBanner severity="error" message={errorMessage} />}
                    </Grid>
                </Grid>
                <Grid container className={classes.innerContainer}>
                    <Grid item xs={12}>
                        <span className={classes.fieldTitle}>Nom</span>{' '}
                        <span className={classes.charactersLimit}>(255 charactères)</span>
                    </Grid>
                    <Grid item xs={12}>
                        <TextFieldComponent formik={formik} label="name" />
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

export default TeamModal;

TeamModal.defaultProps = {
    handleClose: () => {},
    onSubmitRefresh: () => {},
    teamItem: null,
};

TeamModal.propTypes = {
    handleClose: PropTypes.func,
    onSubmitRefresh: PropTypes.func,
    teamItem: PropTypes.object,
    open: PropTypes.bool.isRequired,
};
