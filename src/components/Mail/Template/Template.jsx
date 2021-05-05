import React, { useEffect, useState } from 'react';

// Utilisation de creatable pour le select
import CreatableSelect from 'react-select/creatable';
import Editor from './Editor';
import { useTemplateContent } from '../../../redux/template/hooks';
import { apiClient } from '../../../services/networking/client';
import Loader from '../../Loader';

const BUTTON_INITIAL_STATE = { state: 'send', isLoading: false, inputError: false };
const EMAIL_INITIAL_STATE = { synchronized: false };

// Déclaration des variables par défault.
const TEMPLATE_INITIAL_STATE = { content_template: {}, name: '', uuid: '' };
const BUTTON_SAVE_INITIAL_STATE = { state: 'save', isLoading: false };
const OPTIONS_INITIAL_STATE = { options: [{ label: 'Ajoutez vos options', value: '0', isDisabled: true }], length: 0 };

const Template = () => {
    const [emailSubject, setEmailSubject] = useState('');
    const [buttonState, setButtonState] = useState(BUTTON_INITIAL_STATE);
    const [content] = useTemplateContent();
    const [email, setEmail] = useState(EMAIL_INITIAL_STATE);

    // Template chargé / Bouton de Sauvegarde / Liste d'options du bouton déroulant
    const [template, setTemplate] = useState(TEMPLATE_INITIAL_STATE);
    const [buttonSave, setButtonSave] = useState(BUTTON_SAVE_INITIAL_STATE);
    const [optselect, setOpts] = useState(OPTIONS_INITIAL_STATE);

    const resetEmailState = () => {
        setEmail((state) => ({ ...state, ...EMAIL_INITIAL_STATE }));
        setButtonState(BUTTON_INITIAL_STATE);
    };

    function clearBody(body) {
        return body.substring(body.indexOf('<table'), body.lastIndexOf('</table>') + 8);
    }

    useEffect(resetEmailState, [content]);

    const handleClickConfirmButton = async () => {
        if (!email.synchronized || email.recipient_count < 1) {
            throw new Error('Send not allowed');
        }

        setButtonState((state) => ({ ...state, ...{ isLoading: true } }));

        const response = await apiClient.post(`/v3/adherent_messages/${email.uuid}/send`);

        setEmail((state) => ({ ...state, ...{ synchronized: false } }));

        if (response === 'OK') {
            setButtonState((state) => ({ ...state, ...{ state: 'success', isLoading: false } }));
        } else {
            setButtonState((state) => ({ ...state, ...{ state: 'error', isLoading: false } }));
        }
    };

    const editEmail = async () => {
        const body = {
            type: 'candidate',
            label: `DataCorner: ${emailSubject}`,
            subject: emailSubject,
            content: clearBody(content.chunks.body),
        };

        // if (email.uuid) {
        //     return apiClient.put(`/v3/adherent_messages/${email.uuid}`, body);
        // }

        return apiClient.post('/v3/adherent_messages', body);
    };

    const getEmailStatus = (uuid) => apiClient.get(`/v3/adherent_messages/${uuid}`);

    const handleClickSendButton = async () => {
        setButtonState((state) => ({ ...state, ...{ isLoading: true } }));

        // step 1: create email
        const response = await editEmail();
        setEmail((state) => ({ ...state, ...response }));

        // step 2: check email status
        let callCount = 0;
        const timer = setInterval(async () => {
            const emailStatusResponse = await getEmailStatus(response.uuid);

            // eslint-disable-next-line no-plusplus
            if (++callCount >= 10 || (emailStatusResponse.synchronized === true)) {
                clearInterval(timer);
                setEmail((state) => ({ ...state, ...emailStatusResponse }));
                setButtonState((state) => ({ ...state, ...{ state: 'confirme', isLoading: false } }));
            }
        }, 2000);
    };

    async function LoadTemplates() {
        const result = await apiClient.get('/v3/email_templates');
        const opts = [];
        result.items.forEach((item) => {
            // eslint-disable-next-line no-restricted-syntax
            for (const [key, value] of Object.entries(item)) {
                if (key === 'label') {
                    opts.push({ label: `${value}`, value: `${value}` });
                }
            }
        });
        setOpts((state) => ({
            ...state,
            options: state.options.concat(opts),
            length: state.length + 1,
        }));
    }

    useEffect(() => {
        LoadTemplates();
    }, []);

    useEffect(() => {
        if (content && 'design' in content) setTemplate((state) => ({ ...state, content_template: content.design }));
    }, [content]);

    useEffect(() => {

    }, [optselect]);

    useEffect(() => {

    }, [template]);

    const saveTemplate = async (bodyreq) => apiClient.post('/v3/email_templates', bodyreq);

    const handleClickSaveButton = async () => {
        setButtonSave((state) => ({ ...state, ...{ isLoading: true } }));
        const bodyreq = {
            label: template.name.label,
            content: JSON.stringify(content.design),
        };

        // Check saved
        let callCount = 0;
        const timer = setInterval(async () => {
            const templateStatusResponse = await saveTemplate(bodyreq);

            // eslint-disable-next-line no-plusplus
            if (++callCount >= 10 || (templateStatusResponse.uuid !== '')) {
                clearInterval(timer);
                setOpts(optselect.options.map((item) => {
                    if (item.label !== templateStatusResponse.label) return item;
                    return { ...item, uuid: templateStatusResponse.uuid };
                }));
                setButtonSave((state) => ({ ...state, ...{ state: 'confirme', isLoading: false } }));
            }
        }, 2000);
    };

    let saveButton;

    if (buttonSave.state === 'save') {
        const disableState = (template.name === '' || template.content_template === {}) || buttonSave.isLoading;
        saveButton = (
            <button
                className={`btn btn-primary ${disableState ? 'disabled' : null}`}
                type="button"
                onClick={disableState ? null : handleClickSaveButton}
            >
                <span className="mr-2">
                    {buttonSave.isLoading ? <Loader /> : <i className="fa fa-save" />}
                </span>
                Sauvegarder le Template
            </button>
        );
    }

    const handleCreateOption = (newEntry) => {
        setOpts((state) => ({
            ...state,
            options: [...state.options, { label: newEntry, value: newEntry }],
            length: state.length + 1,
        }));
        setTemplate((state) => ({ ...state, name: newEntry }));
    };

    const LoadingT = async () => {
        if (template.uuid !== '') {
            const result = await apiClient.get(`/v3/email_templates/${template.uuid}`);
            setTemplate((state) => ({ ...state, content_template: result.content }));
        }
    };

    const handleSelectChange = (selected) => {
        setTemplate((state) => ({ ...state, name: selected }));
        LoadingT();
    };

    let sendButton;

    if (buttonState.state === 'send') {
        const disableState = !content || buttonState.isLoading || !emailSubject;
        sendButton = (
            <button
                className={`btn btn-primary ${disableState ? 'disabled' : null}`}
                type="button"
                onClick={disableState ? null : handleClickSendButton}
                onMouseEnter={() => setButtonState((state) => ({ ...state, ...{ inputError: !emailSubject } }))}
                onMouseLeave={() => setButtonState((state) => ({ ...state, ...{ inputError: false } }))}
            >
                <span className="mr-2">
                    {buttonState.isLoading ? <Loader /> : <i className="fa fa-paper-plane-o" />}
                </span>
                Envoyer e-mail
            </button>
        );
    } else if (buttonState.state === 'confirme') {
        sendButton = (
            <button className="btn btn-success" type="button" onClick={handleClickConfirmButton} disabled={!email.recipient_count || email.recipient_count < 1}>
                <span className="mr-2">
                    {buttonState.isLoading ? <Loader /> : <i className="fa fa-paper-plane-o" />}
                </span>
                Confirmer l&apos;envoi (contact{email.recipient_count > 1 && 's'}: {email.recipient_count})
            </button>
        );
    } else if (buttonState.state === 'success') {
        sendButton = (
            <button className="btn btn-outline-success" type="button" disabled>
                <span className="mr-2">
                    <i className="fa fa-check" />
                </span>
                E-mail envoyé 🎉
            </button>
        );
    } else if (buttonState.state === 'error') {
        sendButton = (
            <button className="btn btn-outline-danger" type="button" disabled>
                <span className="mr-2">
                    <i className="fa fa-bomb" />
                </span>
                Une erreur est survenue
            </button>
        );
    }

    return (
        <div>
            <div className="mb-3 text-right row justify-content-end">
                <div className="col-6 form-inline">
                    <CreatableSelect // Select pour le template
                        style={{
                            width: '50%',
                        }}
                        className="col mr-3"
                        isClearable
                        onCreateOption={handleCreateOption}
                        onChange={handleSelectChange} // Call LoadTemplate
                        options={optselect.options}
                        formatCreateLabel={(inputValue) => `Créer ${inputValue}`}
                        value={template.name}
                        placeholder="Choisissez votre Template ou créer en un nouveau"
                    />
                    {saveButton}
                </div>
                <div className="col-6 form-inline justify-content-end">
                    <input
                        type="text"
                        className={`form-control col mr-3 ${buttonState.inputError ? 'is-invalid' : ''}`}
                        placeholder="Objet du mail"
                        required
                        value={emailSubject}
                        onChange={(event) => setEmailSubject(event.target.value)}
                    />
                    {sendButton}
                </div>
            </div>

            <Editor loadedT={template.content_template} />
        </div>
    );
};

export default Template;
