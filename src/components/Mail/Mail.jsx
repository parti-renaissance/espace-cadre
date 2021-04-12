import React from 'react'
import Template from './Template/Template'
import Audience from './Audience/Audience'
import "./Mail.scss"

const Mail = () => {
    return (
        <div>
            <button
                id="audienceCollapse"
                type="button"
                className="audiencebutton btn btn-light bg-blue rounded-pill shadow-sm mb-4"
            >
                <i className="fa fa-bars"></i> Audience
            </button>
            <div className="mail">
                <Template/>
                <Audience/>
            </div>
        </div>
    )
}

export default Mail;