import React, { useEffect } from 'react';
import $ from 'jquery';
import './Audience.scss';

const Audience = () => {
    useEffect(() => {
        $('#audienceCollapse').on('click', () => {
            $('#audience').toggle('hidden');
        });
    }, []);

    return (
        <>
            <div className="audience" id="audience" style={{ display: 'none' }}>
                <h3>Audience Cible</h3>
                <div className="parts">
                    <div className="part">Contacts</div>
                    <div className="part">Geographie</div>
                    <div className="part">Boutons toggle Adhérents Sympatisants</div>
                    <div className="part">Age</div>
                    <div className="part">Centres d&apos;interets</div>
                    <div className="part">Envoi/validation</div>
                </div>
            </div>
        </>
    );
};

export default Audience;
