/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

const ELECTION = 'Élection';
const YEAR = 'Année';
const NUANCE = 'Nuance';
const LIST = 'Liste';
const ROUND = 'Tour';
const VOTE = 'Voix';
const TABLE_TITLE = [
    {
        code: ELECTION,
        label: 'Élection',
    },
    {
        code: YEAR,
        label: 'Année',
    },
    {
        code: NUANCE,
        label: 'Nuance',
    },
    {
        code: LIST,
        label: 'Liste',
    },
    {
        code: ROUND,
        label: 'Tour',
    },
    {
        code: VOTE,
        label: 'Voix',
    },
];

const ElectionTable = ({
    row: {
        election, annee, nom_liste, tour, voix, nuance,
    },
}) => (
    <table className="table elections-table">
        <thead>
            <tr>{TABLE_TITLE.map((title, i) => <th scope="col" key={i + 1}>{title.label}</th>)}
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{election}</td>
                <td>{annee}</td>
                <td>{nuance}</td>
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
