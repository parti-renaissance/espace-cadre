/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

const ElectionModal = ({
    row: {
        voix, nuance, liste, voixPourcent,
    },
}) => (
    <div className="election-modal-content">
        <div className="candidat-name">{liste}</div>
        <div className="candidat-nuance">{nuance}</div>
        <div className="candidat-resultat">{voix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} voix - <span className="resultat-span">{voixPourcent}%</span></div>
        <div className="progress" style={{ height: '8px' }}>
            <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${voixPourcent}%` }}
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
