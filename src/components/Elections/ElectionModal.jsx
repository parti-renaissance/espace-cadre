/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

const ElectionModal = ({
    row: {
        voix, nomNuance, liste, voixPourcent, codeCouleur,
    },
}) => (
    <div className="election-modal-content">
        <div className="candidat-name">{liste}</div>
        <div className="candidat-nuance">{nomNuance}</div>
        <div className="candidat-resultat">{voix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} voix - <span className="resultat-span">{voixPourcent}%</span></div>
        <div className="progress" style={{ height: '8px' }}>
            <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${voixPourcent}%`, backgroundColor: `${codeCouleur}` }}
                aria-valuenow={voixPourcent}
                aria-valuemin="0"
                aria-valuemax="100"
            />
        </div>
    </div>
);

export default ElectionModal;

ElectionModal.propTypes = {
    row: PropTypes.objectOf(Object).isRequired,
};
