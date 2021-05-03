import React, { useState, useEffect } from 'react';

import 'grapesjs/dist/css/grapes.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import { apiClient } from '../../../services/networking/client';

import Editor from './grapesjs/Editor';

const Template = () => {
    // Set State elements
    // eslint-disable-next-line no-unused-vars
    const [mailObjet, setObjet] = useState({
        type: 'candidate',
        label: '',
        subject: '',
        content: '',
    });
    const [mailUuid, setMailUuid] = useState('');
    const [message, setMessage] = useState('');

    const [userTempList, setUserTempList] = useState([]);
    const [template, setTemplate] = useState({ label: '', content: '', selected: {} });
    const [content, setContent] = useState('');
    const [show, setShow] = useState(false);
    const [showSave, setShowSave] = useState(false);
    const [showDel, setDel] = useState(false);
    const [showSend, setSend] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseDel = () => setDel(false);
    const handleShowDel = () => {
        if (mailObjet.label === '' || mailObjet.content === '') return;
        setDel(true);
    };

    const handleCloseSave = () => setShowSave(false);
    const handleShowSave = () => setShowSave(true);

    const handleShowSend = () => setSend(true);

    async function LoadTemplate() {
        const result = await apiClient.get('/v3/email_templates');
        setUserTempList(result.items);
    }

    // Handle CSS HTML change
    function handleChangeContent(objectTemplate) {
        if (typeof (objectTemplate) === 'object') return;
        setTemplate((prevstate) => ({ ...prevstate, content: objectTemplate }));
        setObjet((prevstate) => ({ ...prevstate, content: objectTemplate }));
    }

    // Handle Select Template (changement dans champs nom)
    const handleSelected = (event) => {
        if (event.target.value === '1') {
            setTemplate((prevstate) => ({
                ...prevstate,
                selected: event.target.value,
                label: 'Default',
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
        setObjet((prevstate) => ({
            ...prevstate,
            subject: event.target.value,
            label: event.target.value,
        }));
    };

    // Handle Template select change
    const handleTemplate = (event) => {
        setTemplate((prevstate) => ({ ...prevstate, label: event.target.value }));
    };

    // Sauvegarder template
    async function saveTemplate() {
        if (template.content === '' || template.label === 'Default') {
            return;
        }
        handleCloseSave();
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
        return () => {

        };
    }, [template.selected]);

    useEffect(() => {
    }, [userTempList]);

    useEffect(() => {
        setTemplate((prevstate) => ({ ...prevstate, content: template.content }));
    }, [template.content]);

    async function sendMail() {
        if (mailObjet.label === '' || mailObjet.content === '') return;
        handleCloseDel();
        handleShowSend();
        const response = await apiClient.post('/v3/adherent_messages', mailObjet);
        setMailUuid(response.uuid);
    }
    // Send mailer
    useEffect(() => {
        function setCheck() {
            let repeat = 0;
            const checkSynch = setInterval(async () => {
                async function synchStatus() {
                    const statusReq = await apiClient.get(`/v3/adherent_messages/${mailUuid}`);
                    if (statusReq.synchronized === true
                        && (statusReq.recipient_count > 0)) return true;
                    return false;
                }
                repeat += 1;
                if (repeat === 5) {
                    clearInterval(checkSynch);
                    setTimeout(setSend(false), 3000);
                    setSuccess(true);
                    setMessage('échoué.');
                }
                const res = await synchStatus();
                if (res === true) {
                    clearInterval(checkSynch);
                    setTimeout(setSend(false), 3000);
                    await apiClient.post(`/v3/adherent_messages/${mailUuid}/send`);
                    setSuccess(true);
                    setMessage('réussi.');
                }
            }, 2500);
        }
        if (mailUuid !== '') {
            setCheck();
        }
    }, [mailUuid]);

    useEffect(() => {

    }, [success]);

    return (
        <div className="templates" style={{ overflow: 'auto' }}>
            <h3>Messagerie</h3>
            <div className="main_fields">
                <div className="header">
                    <div className="object_div">
                        <input placeholder="Objet du Mail" className="object_input" onChange={handleObj} id="email-subject-input" />
                    </div>
                    <div className="select_div">
                        <select className="custom-select select_input rounded" id="basic" value={template.selected.uuid} onChange={handleSelected}>
                            <option value="1">Nouveau Template</option>
                            {userTempList !== 0 && userTempList.map((tmplte) => (
                                <option value={tmplte.uuid} key={tmplte.label}>{tmplte.label}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
                <div className="objet">
                    <div className="send_div">
                        <button className="send_btn buttons btn-block" type="button" onClick={handleShowDel}><i className="fa fa-paper-plane-o" /><span className="hidden-sm hidden-xs">&nbsp;&nbsp;&nbsp;Envoyer Mail</span></button>
                    </div>
                    <div className="register_div">
                        <button className="register_btn buttons btn-block" onClick={handleShowSave} type="button"><i className="fa fa-floppy-o" /><span className="hidden-sm hidden-xs">&nbsp;&nbsp;&nbsp;Enregistrer Modifications</span></button>
                    </div>
                </div>
            </div>
            <div className="editor_div">
                <Editor onChange={handleChangeContent} loadingContent={content} />
            </div>

            {showSave && (
                <Modal show={showSave} onHide={handleCloseSave}>
                    <Modal.Header closeButton>
                        <Modal.Title>Enregistrement des Modifications</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h6 style={{
                            display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%',
                        }}
                        >
                            Créer ou modifier la Template
                        </h6>
                        <input
                            style={{
                                textAlign: 'center', flexDirection: 'row', justifyContent: 'center', width: '100%',
                            }}
                            placeholder={template.label}
                            onChange={handleTemplate}
                            value={template.label}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="register_modal" onClick={saveTemplate}>
                            Enregistrer
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

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
                    <Modal.Header>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Êtes-vous sûr de vouloir envoyer le mail ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDel}>
                            Annuler
                        </Button>
                        <Button variant="primary" onClick={sendMail}>
                            Confirmer
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {showSend && (
                <Modal show={showSend} backdrop="static" closeButton="false">
                    <Modal.Header>
                        <Modal.Title>Veuillez patienter pendant l&#39;envoi du mail</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </Modal.Body>
                </Modal>
            )}

            {success && (
                <Modal show={success} onHide={() => { setSuccess(false); }}>
                    <Modal.Header>
                        <Modal.Title>Envoi du Mail</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>L&#39;envoi de votre mail a {message}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { setSuccess(false); }}>
                            Fermer
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default Template;
