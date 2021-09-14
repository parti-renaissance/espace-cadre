/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { LinearProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    linearProgress: {
        height: '8px',
        borderRadius: '12px',
    },
    '@global': {
        '.MuiLinearProgress-barColorPrimary': {
            // Find a way to dynamically change the color of progressBar. Need to use the code_couleur prop as background style property
        },
    },
});

const ElectionModal = ({
    row: {
        nuance, nom, prenom, voix, code_couleur,
    }, exprimes,
}) => {
    const classes = useStyles();

    return (
        <div className="election-modal-content">
            <div className="candidat-name">{prenom} {nom}</div>
            <div className="candidat-nuance">{nuance}</div>
            <div className="candidat-resultat">{voix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} voix - <span className="resultat-span">{((voix / exprimes) * 100).toFixed(2)}%</span></div>
            <div className="progress" style={{ height: '8px' }}>
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${(voix / exprimes) * 100}%`, backgroundColor: `${code_couleur}` }}
                    aria-valuenow={(voix / exprimes) * 100}
                    aria-valuemin="0"
                    aria-valuemax="100"
                />
            </div>
            <LinearProgress
                variant="determinate"
                value={(voix / exprimes) * 100}
                className={classes.linearProgress}
            />
        </div>
    );
};

export default ElectionModal;

ElectionModal.propTypes = {
    row: PropTypes.objectOf(Object).isRequired,
    exprimes: PropTypes.number.isRequired,
};
