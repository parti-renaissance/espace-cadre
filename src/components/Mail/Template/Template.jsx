import React, { useEffect, useState } from 'react';

import CreatableSelect from 'react-select/creatable';
import Editor from './Editor';
import { useTemplateContent } from '../../../redux/template/hooks';
import { apiClient } from '../../../services/networking/client';
import Loader from '../../Loader';

const BUTTON_INITIAL_STATE = { state: 'send', isLoading: false, inputError: false };
const EMAIL_INITIAL_STATE = { synchronized: false };

const TEMPLATE_INITIAL_STATE = { content_template: '', current_template: '' };
const BUTTON_SAVE_INITIAL_STATE = { state: 'save', isLoading: false };
const OPTIONS_INITIAL_STATE = { options: [{ label: 'Ajoutez vos options', value: '0', isDisabled: true }], length: 0 };

const Template = () => {
    const [emailSubject, setEmailSubject] = useState('');
    const [buttonState, setButtonState] = useState(BUTTON_INITIAL_STATE);
    const [content, setContent] = useTemplateContent();
    const [email, setEmail] = useState(EMAIL_INITIAL_STATE);

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

    async function loadTemplates() {
        const result = await apiClient.get('/v3/email_templates');
        const opts = [];
        result.items.forEach((item) => {
            opts.push({ label: item.label, value: item.uuid });
        });
        setOpts((state) => ({
            ...state,
            options: state.options.concat(opts),
            length: state.length + 1,
        }));
    }

    useEffect(() => {
        loadTemplates();
    }, []);

    const createTemplate = async (bodyreq) => apiClient.post('/v3/email_templates', bodyreq);
    const updateTemplate = async (bodyreq, id) => apiClient.put(`/v3/email_templates/${id}`, bodyreq);

    const handleClickSaveButton = async () => {
        setButtonSave((state) => ({ ...state, ...{ isLoading: true } }));
        const bodyreq = {
            label: template.current_template.label,
            content: JSON.stringify(content.design),
        };

        // eslint-disable-next-line array-callback-return
        let templateStatusResponse = null;
        const exist = optselect.options.find((option) => {
            if (option.label === template.current_template.label) return true;
            return false;
        });
        if (exist === undefined || exist.value === exist.label) {
            templateStatusResponse = await createTemplate(bodyreq);
        } else {
            templateStatusResponse = await updateTemplate(bodyreq, template.current_template.value);
        }
        // eslint-disable-next-line no-plusplus
        if (templateStatusResponse.uuid !== '') {
            setOpts(optselect.options.map((item) => {
                if (item.label !== templateStatusResponse.label) return item;
                return { ...item, value: templateStatusResponse.uuid };
            }));
            setButtonSave((state) => ({ ...state, ...{ state: 'confirme', isLoading: false } }));
        }
    };

    let saveButton;

    if (buttonSave.state === 'save') {
        const disableState = (template.current_template === ''
        || content === null)
        || buttonSave.isLoading;
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
        if (optselect.options !== []) {
            setOpts((state) => ({
                ...state,
                options: [...state.options, { label: newEntry, value: newEntry }],
                length: state.length + 1,
            }));
        }
        setTemplate((state) => ({ ...state, current_template: newEntry }));
    };

    const loadingTemplate = async () => {
        if (template.current_template !== '' && template.current_template.value !== undefined) {
            const result = await apiClient.get(`/v3/email_templates/${template.current_template.value}`);
            setContent({ ...content, ...{ design: JSON.parse(result.content) } });
        }
    };

    const handleSelectChange = (selected) => {
        if (selected !== null) {
            loadingTemplate();
            setTemplate((state) => ({ ...state, current_template: selected }));
        } else {
            setTemplate((state) => ({ ...state, current_template: '' }));
        }
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
                    <CreatableSelect
                        className="col mr-3"
                        isClearable
                        onCreateOption={handleCreateOption}
                        onChange={handleSelectChange}
                        options={optselect.options}
                        formatCreateLabel={(inputValue) => `Créer ${inputValue}`}
                        value={template.current_template}
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

            <Editor />
        </div>
    );
};

export default Template;
