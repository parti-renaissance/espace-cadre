import React from 'react'
import "./Mail.scss"

const Mail = () => {
    return (
        <div className="mail">
            <div className="templates">
                Mes Templates
                <div className="header">
                    Header
                </div>
                <div className="grapejs">
                    GrapeJs
                </div>
            </div>
            <div className="audience">
                audience
                <div className="parts">
                    <div className="contacts">Contacts</div>
                    <div className="contacts">Geographie</div>
                    <div className="contacts">Boutons toggle Adhérents Sympatisants</div>
                    <div className="contacts">Age</div>
                    <div className="contacts">Centres d'interets</div>
                    <div className="contacts">Envoi/validation</div>
                </div>
            </div>
        </div>
    )
}

export default Mail;