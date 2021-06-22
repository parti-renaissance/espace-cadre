/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

const ElectionTable = ({
    row: {
        election, annee, nom_liste, tour, voix,
    },
}) => (
    <table className="table elections-table">
        <thead>
            <tr>
                <th scope="col">Election</th>
                <th scope="col">Année</th>
                <th scope="col">Liste</th>
                <th scope="col">Tour</th>
                <th scope="col">Voix</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{election}</td>
                <td>{annee}</td>
                <td>{nom_liste}</td>
                <td>{tour}</td>
                <td>{voix}</td>
            </tr>
        </tbody>
    </table>
);

export default ElectionTable;

ElectionTable.propTypes = {
    row: PropTypes.objectOf(Object).isRequired,
};
