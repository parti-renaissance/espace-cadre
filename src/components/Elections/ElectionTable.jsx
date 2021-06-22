/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

const ElectionTable = ({
    row: {
        nom_liste, tour, voix, nuance,
    },
}) => (
    <tbody>
        <tr>
            <td>{nuance}</td>
            <td>{nom_liste}</td>
            <td>{tour}</td>
            <td>{voix}</td>
        </tr>
    </tbody>
);

export default ElectionTable;

ElectionTable.propTypes = {
    row: PropTypes.objectOf(Object).isRequired,
};
