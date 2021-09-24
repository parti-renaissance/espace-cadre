import React, { useCallback, useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import {
    Grid, Button, Box, makeStyles, createStyles,
} from '@material-ui/core';
import Loader from '../../Loader';
import { apiClient } from '../../../services/networking/client';
import { useTemplateContent } from '../../../redux/template/hooks';

const useStyles = makeStyles((theme) => createStyles({
    materialButton: {
        width: '100%',
        backgroundColor: theme.palette.blueCorner,
        color: theme.palette.whiteCorner,
    },
}));

const TEMPLATE_INITIAL_STATE = { content_template: '', current_template: '' };
const OPTIONS_INITIAL_STATE = { options: [] };

const TemplateSelect = () => {
    const [content, setContent] = useTemplateContent();
    const [template, setTemplate] = useState(TEMPLATE_INITIAL_STATE);
    const [isLoadingTemplateButton, setIsLoadingTemplateButton] = useState(false);
    const [optselect, setOpts] = useState(OPTIONS_INITIAL_STATE);
    const classes = useStyles();

    const handleSelectChange = (selected, action) => {
        switch (action.action) {
        case 'select-option':
            if (selected !== null) {
                setTemplate((state) => ({ ...state, current_template: selected }));
            } else {
                setTemplate((state) => ({ ...state, current_template: '' }));
            }
            break;
        case 'create-option':
            if (optselect && optselect.options.length !== 0) {
                setOpts((state) => ({
                    ...state,
                    options: [...state.options, { label: selected.label, value: selected.label }],
                }));
            }
            setTemplate((state) => ({ ...state, current_template: selected }));
            break;
        case 'clear':
            setTemplate((state) => ({ ...state, current_template: '' }));
            break;
        default:
            // FIXME please :)
            // eslint-disable-next-line no-console
            console.log('Sorry, we are out.');
        }
    };

    const createTemplate = async (bodyreq) => apiClient.post('/v3/email_templates', bodyreq);
    const updateTemplate = async (bodyreq, id) => apiClient.put(`/v3/email_templates/${id}`, bodyreq);

    const handleClickSaveButton = async () => {
        setIsLoadingTemplateButton(true);
        const bodyreq = {
            label: template.current_template.label,
            content: JSON.stringify(content.design),
        };
        // eslint-disable-next-line array-callback-return
        let templateStatusResponse = null;
        const exist = optselect.options.find((option) => option.label === template.current_template.label);
        if (exist === undefined || exist.value === exist.label) {
            templateStatusResponse = await createTemplate(bodyreq);
        } else {
            templateStatusResponse = await updateTemplate(bodyreq, template.current_template.value);
        }
        // eslint-disable-next-line no-plusplus
        if (templateStatusResponse.uuid !== '') {
            const optupdated = optselect.options.findIndex((option) => option.label === templateStatusResponse.label);
            const save = [...optselect.options];
            save[optupdated] = { ...save[optupdated], uuid: templateStatusResponse.uuid };
            setOpts((state) => ({
                ...state,
                options: save,
            }));
            setIsLoadingTemplateButton(false);
        }
    };

    const templateButtonDisableState = template.current_template === ''
        || template.current_template.label === undefined
        || content === null
        || isLoadingTemplateButton;

    const saveButton = (
        <Button
            className={`btn ${classes.materialButton}`}
            disabled={templateButtonDisableState}
            style={{
                padding: '7px',
            }}
            onClick={templateButtonDisableState ? null : handleClickSaveButton}
        >
            <Box component="span" style={{ marginRight: '8px' }}>
                {isLoadingTemplateButton ? <Loader /> : <i className="fa fa-save" />}
            </Box>
            Sauvegarder
        </Button>
    );

    async function loadTemplates() {
        const result = await apiClient.get('/v3/email_templates');
        const opts = [];
        result.items.forEach((item) => {
            opts.push({ label: item.label, value: item.uuid });
        });
        setOpts((state) => ({
            ...state,
            options: state.options.concat(opts),
        }));
    }

    const loadingTemplate = useCallback(
        async () => {
            if (template.current_template !== '' && template.current_template.value !== undefined) {
                const result = await apiClient.get(`/v3/email_templates/${template.current_template.value}`);
                setContent({ ...content, ...{ design: JSON.parse(result.content), externalUpdate: true } });
            }
        }, [content, setContent, template.current_template],
    );

    useEffect(() => {
        if (template.current_template !== '' && template.current_template.value !== template.current_template.label) {
            loadingTemplate();
        }
    }, [loadingTemplate, template.current_template]);

    useEffect(() => {
        loadTemplates();
    }, []);

    return (
        <Grid container style={{ marginBottom: '8px' }} spacing={2}>
            <Grid item xs={12} sm={8}>
                <CreatableSelect
                    isClearable
                    onChange={handleSelectChange}
                    options={optselect.options}
                    noOptionsMessage={() => 'Aucun template'}
                    formatCreateLabel={(inputValue) => `Créer ${inputValue}`}
                    value={template.current_template}
                    placeholder="Créez ou choisissez un template"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                {saveButton}
            </Grid>
        </Grid>
    );
};

export default TemplateSelect;
