import React from 'react';

const ElectionTable = ({ row }) => (
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
                <td>{row.election}</td>
                <td>{row.annee}</td>
                <td>{row.nom_liste}</td>
                <td>{row.tour}</td>
                <td>{row.voix}</td>
            </tr>
        </tbody>
    </table>
);

export default ElectionTable;
