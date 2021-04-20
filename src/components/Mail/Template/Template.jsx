import React, { useState, useEffect } from 'react';

import 'grapesjs/dist/css/grapes.min.css';
import { apiClient } from '../../../services/networking/client';
import Editor from './grapesjs/Editor';
import './Template.scss';

const Template = () => {
    // Set State elements
    // eslint-disable-next-line no-unused-vars
    // const [userTempList, setUserTempList] = useState(""):
    const [template, setTemplate] = useState({ label: '', content: '' });
    const [mailObjet, setObjet] = useState('');

    // Handle CSS HTML change
    function handleChangeContent(saveTemplate) {
        if (typeof (saveTemplate) === 'object') return;
        setTemplate((prevstate) => ({ ...prevstate, content: saveTemplate }));
    }

    // eslint-disable-next-line no-unused-vars
    function handleChangeLabel(saveTemplate) {
        if (typeof (saveTemplate) === 'object') return;
        setTemplate((prevstate) => ({ ...prevstate, label: saveTemplate }));
    }

    // Handle mail object change
    const handleObj = (event) => {
        setObjet(event.target.value);
    };

    // Handle Template select change
    const handleTemplate = (event) => {
        setTemplate((prevstate) => ({ ...prevstate, label: event.target.value }));
    };

    // Sauvegarder template
    const saveTemplate = () => {
        if (template.content === '' || template.label === '') {
            return;
        }
        const registered = async () => {
            await apiClient.post('/v3/email_templates', template);
        };
        console.log(`J'ai enregistré ? : ${registered}`);
    };

    useEffect(() => {
    }, []);

    // Actions on mail object change
    useEffect(() => {

    }, [mailObjet]);

    // Actions on template Select
    useEffect(() => {
        console.log(`Content : ${template.content}`);
        console.log(`Label : ${template.label}`);
    }, [template]);

    return (
        <div className="templates" style={{ overflow: 'auto' }}>
            <h3>Mes Templates</h3>
            <div className="header">
                <select className="custom-select" id="basic" onChange={handleTemplate}>
                    <option defaultValue="0" value="0">Selection du Template</option>
                    <option value="Template 1">Template 1</option>
                    <option value="Template 2">Template 2</option>
                    <option value="Template 3">Template 3</option>
                </select>
                <button className="btn-danger button_fields" type="button">Supprimer</button>
            </div>

            <div className="objet">

                <label htmlFor="email-subject-input">
                    Objet de l&apos;Email&nbsp;:&nbsp;
                    <input placeholder="Objet" onChange={handleObj} id="email-subject-input" />
                </label>
                <label htmlFor="template_name">&nbsp;Nom du Template &nbsp;
                    <input placeholder={template.label} onChange={handleTemplate} id="template_name" />
                    &nbsp;
                </label>

                <button className="btn-success button_fields" onClick={saveTemplate} type="button">Save Template</button>
            </div>
            <Editor onChange={handleChangeContent} />
        </div>
    );
};

export default Template;
