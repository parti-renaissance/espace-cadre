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
    const [mailObjet, setObjet] = useState('');
    const [userTempList, setUserTempList] = useState([]);
    const [template, setTemplate] = useState({ label: '', content: '', selected: {} });
    const [content, setContent] = useState('');
    const [show, setShow] = useState(false);
    const [showDel, setDel] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseDel = () => setDel(false);
    const handleShowDel = () => setDel(true);

    async function LoadTemplate() {
        const result = await apiClient.get('/v3/email_templates');
        setUserTempList(result.items);
    }

    // Handle CSS HTML change
    function handleChangeContent(objectTemplate) {
        if (typeof (objectTemplate) === 'object') return;
        setTemplate((prevstate) => ({ ...prevstate, content: objectTemplate }));
    }

    // Handle Select Template
    const handleSelected = (event) => {
        if (event.target.value === '1') {
            setTemplate((prevstate) => ({
                ...prevstate,
                selected: event.target.value,
                label: 'Nouveau',
            }));
        } else {
            const labeltmp = userTempList.find((tplt) => (tplt.uuid === event.target.value));
            setTemplate((prevstate) => ({
                ...prevstate,
                selected: userTempList.find((tplt) => (tplt.uuid === event.target.value)),
                label: labeltmp.label,
            }));
        }
    };

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
        const status = userTempList.some((item) => (item.label === template.label));

        if (status) {
            await apiClient.put(`/v3/email_templates/${template.selected.uuid}`, template);
            LoadTemplate();
        } else {
            await apiClient.post('/v3/email_templates', template);
            LoadTemplate();
        }
        handleShow();
    }

    async function deleteTemplate() {
        if (template.selected !== '1') {
            await apiClient.delete(`/v3/email_templates/${template.selected.uuid}`);
            setContent('clear');
            setTemplate((prevstate) => ({
                ...prevstate, label: '', content: '', selected: '',
            }));
            LoadTemplate();
            handleCloseDel();
        }
    }

    useEffect(() => {
        LoadTemplate();
    }, []);

    // Actions on template Select
    useEffect(() => {
        async function loadOnSelect() {
            if (template.selected.uuid !== undefined && (template.selected !== '1')) {
                const result = await apiClient.get(`/v3/email_templates/${template.selected.uuid}`);
                setTemplate((prevstate) => (
                    { ...prevstate, content: result.content, label: result.label }));
                setContent(result.content);
            }
        }

        loadOnSelect();
    }, [template.selected]);

    useEffect(() => {
    }, [userTempList]);

    return (
        <div className="templates" style={{ overflow: 'auto' }}>
            <h3>Mes Templates</h3>
            <div className="header">
                <select className="custom-select" id="basic" value={template.selected.uuid} onChange={handleSelected}>
                    <option value="1">Selection du Template</option>
                    {userTempList !== 0 && userTempList.map((tmplte) => (
                        <option value={tmplte.uuid} key={tmplte.label}>{tmplte.label}</option>
                    ))}
                </select>
                <button className="btn-danger button_fields" type="button" onClick={handleShowDel}>Supprimer</button>&nbsp;

            </div>
            <div className="objet">

                <label htmlFor="email-subject-input">
                    Objet de l&apos;Email&nbsp;:&nbsp;
                    <input placeholder="Objet" onChange={handleObj} id="email-subject-input" />
                </label>
                <label htmlFor="template_name">&nbsp;Nom du Template &nbsp;
                    <input placeholder={template.label} onChange={handleTemplate} id="template_name" value={template.label} />
                    &nbsp;
                </label>

                <button className="btn-success button_fields" onClick={saveTemplate} type="button">Sauvegarder</button>
                &nbsp;<button className="btn-primary button_fields" type="button">Envoyer le Mail</button>
            </div>
            <Editor onChange={handleChangeContent} loadingContent={content} />

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

            {showDel && (
                <Modal show={showDel} onHide={handleCloseDel}>
                    <Modal.Header closeButton>
                        <Modal.Title>Suppression du Template</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Êtes vous sûr de vouloir supprimer ce template ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDel}>
                            Annuler
                        </Button>
                        <Button variant="primary" onClick={deleteTemplate}>
                            Confirmer
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

        </div>
    );
};

export default Template;
