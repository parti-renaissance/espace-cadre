import React from 'react';
import {
    makeStyles, createStyles, Dialog, Box, Grid, Button, TextField, FormControlLabel, Checkbox,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiClient } from '../../services/networking/client';

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
    errorMessage: {
        fontSize: '10px',
        color: theme.palette.statusError,
        background: theme.palette.backgroundError,
        padding: '6px 16px',
        borderRadius: '8.35px',
    },
}));

const riposteSchema = Yup.object({
    title: Yup.string()
        .min(1, 'Minimum 1 charactère')
        .max(255, 'Maximum 255 charactères')
        .required('Titre obligatoire'),
    body: Yup.string()
        .min(1, 'Minimum 1 charactère')
        .max(255, 'Maximum 255 charactères')
        .required('Texte obligatoire'),
    source_url: Yup.string()
        .url('Ce champ doit être une URL valide')
        .max(255, 'Maximum 255 charactères')
        .required('Url obligatoire'),
});

const FormDialog = ({ open, handleClose }) => {
    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            title: '',
            body: '',
            source_url: '',
            with_notification: true,
            enabled: true,
        },
        validationSchema: riposteSchema,
        onSubmit: (values) => {
            apiClient.post('api/v3/ripostes', values);
            handleClose();
        },
    });

    return (
        <Dialog open={open} onClose={handleClose} classes={{ paper: classes.paper }}>
            <form onSubmit={formik.handleSubmit}>
                <Grid container justifyContent="space-between" className={classes.innerContainer}>
                    <Grid item>
                        <Box component="span" className={classes.modalTitle}>Créer une riposte</Box>
                    </Grid>
                    <Grid item>
                        <Box component="span" className={classes.cross} onClick={handleClose}>X</Box>
                    </Grid>
                </Grid>
                <Grid container className={classes.innerContainer}>
                    <Grid item xs={12}>
                        Titre
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            className={classes.textField}
                            size="small"
                            variant="outlined"
                            id="title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                        />
                        {(formik.touched.title && formik.errors.title) && <Box className={classes.errorMessage}> {formik.errors.title} </Box>}
                    </Grid>
                </Grid>
                <Grid container className={classes.innerContainer}>
                    <Grid item xs={12}>
                        Texte
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            className={classes.textField}
                            size="small"
                            variant="outlined"
                            id="body"
                            name="body"
                            value={formik.values.body}
                            onChange={formik.handleChange}
                        />
                        {(formik.touched.body && formik.errors.body) && <Box className={classes.errorMessage}> {formik.errors.body} </Box>}
                    </Grid>
                </Grid>
                <Grid container className={classes.innerContainer}>
                    <Grid item xs={12}>
                        URL
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            className={`${classes.textField} ${classes.textArea}`}
                            size="small"
                            variant="outlined"
                            id="source_url"
                            name="source_url"
                            value={formik.values.source_url}
                            onChange={formik.handleChange}
                        />
                        {(formik.touched.source_url && formik.errors.source_url) && <Box className={classes.errorMessage}> {formik.errors.source_url} </Box>}
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={(
                                <Checkbox
                                    size="small"
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
                        // disabled={!(formik.isValid && formik.dirty)}
                    >
                        Créer
                    </Button>
                </Grid>
            </form>
        </Dialog>
    );
};

export default FormDialog;

FormDialog.defaultProps = {
    handleClose: () => {},
};

FormDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func,
};
