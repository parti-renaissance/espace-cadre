/* eslint-disable react/require-default-props */
import React from 'react';
import {
    Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button, makeStyles, createStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => createStyles({
    count: {
        color: theme.palette.blueCorner,
        fontWeight: '600',
    },
}));

function ModalComponent({
    open, handleClose, handleSendEmail, audienceSegment,
}) {
    const classes = useStyles();

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Voulez-vous envoyer ce mail ?</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Vous allez envoyer un message à <span className={classes.count}>{audienceSegment?.recipient_count || 0}</span> contact{audienceSegment?.recipient_count > 1 && 's'}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Annuler
                </Button>
                <Button
                    onClick={() => {
                        handleSendEmail();
                        handleClose();
                    }}
                    color="primary"
                >
                    Envoyer
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ModalComponent;

ModalComponent.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleSendEmail: PropTypes.func.isRequired,
    audienceSegment: PropTypes.objectOf(Object),
};
