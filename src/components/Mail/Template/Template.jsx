import React, { useState, useEffect } from 'react';

import 'grapesjs/dist/css/grapes.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { apiClient } from '../../../services/networking/client';

import Editor from './grapesjs/Editor';
import './Template.scss';

const Template = () => {
    // Set State elements
    // eslint-disable-next-line no-unused-vars
    // const [userTempList, setUserTempList] = useState(""):
    const [template, setTemplate] = useState({ label: '', content: '' });
    const [mailObjet, setObjet] = useState('');
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // Handle CSS HTML change
    function handleChangeContent(objectTemplate) {
        if (typeof (objectTemplate) === 'object') return;
        setTemplate((prevstate) => ({ ...prevstate, content: objectTemplate }));
    }

    // eslint-disable-next-line no-unused-vars
    function handleChangeLabel(labelTemplate) {
        if (typeof (labelTemplate) === 'object') return;
        setTemplate((prevstate) => ({ ...prevstate, label: labelTemplate }));
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
    async function saveTemplate() {
        if (template.content === '' || template.label === '') {
            return;
        }
        await apiClient.post('/v3/email_templates', template);
        handleShow();
    }

    useEffect(() => {
    }, []);

    // Actions on mail object change
    useEffect(() => {

    }, [mailObjet]);

    // Actions on template Select
    useEffect(() => {

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

            {show && (
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Template Sauvegardé</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Votre Template a bien été enregistré.
                        Vous pouvez poursuivre
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleClose}>
                            Fermer
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default Template;
