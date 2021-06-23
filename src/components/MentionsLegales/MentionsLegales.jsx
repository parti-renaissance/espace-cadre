import React from 'react';

function MentionsLegales() {
    return (
        <div className="mentionsLegales">
            <div className="version">DataCorner@<strong>{process.env.REACT_APP_VERSION}</strong></div>

            <ul className="mentionLegalesList">
                <li>
                    <a href="https://donnees.en-marche.fr/">
                        Mes données personnelles
                    </a>
                </li>
                <li>
                    <a href="https://en-marche.fr/mentions-legales">
                        Mentions légales
                    </a>
                </li>
                <li>
                    <a href="https://en-marche.fr/politique-cookies">
                        Politique de cookies
                    </a>
                </li>
                <li>
                    <a href="https://en-marche.fr/politique-protection-donnees">
                        Politique de protection des données
                    </a>
                </li>
                <li>
                    <a href="https://www.bkms-system.com/bkwebanon/report/clientInfo?cin=Jp3wHD&c=-1&language=fre">
                        Cellule d&apos;alerte
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default MentionsLegales;
