/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import {
    Grid, Button, Box, makeStyles, createStyles, TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Loader from '../../Loader';
import { apiClient } from '../../../services/networking/client';
import { useTemplateContent } from '../../../redux/template/hooks';

const useStyles = makeStyles((theme) => createStyles({
    templateSelect: {
        border: `1px solid ${theme.palette.gray200}`,
        borderRadius: '8px',
        marginRight: '16px',
    },
    materialButton: {
        color: theme.palette.blue600,
        borderColor: theme.palette.blue600,
        width: '100%',
        padding: '8px 16px',
        borderRadius: '8px',
        '&:hover': {
            background: theme.palette.gray200,
        },
    },
    buttonIcon: {
        marginRight: '8px',
    },
    popper: {
        border: `1px solid ${theme.palette.gray200}`,
        borderRadius: '8px',
        marginTop: '8px',
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
            variant="outlined"
            size="medium"
            className={classes.materialButton}
            disabled={templateButtonDisableState}
            onClick={templateButtonDisableState ? null : handleClickSaveButton}
        >
            <Box>
                {isLoadingTemplateButton ? <Loader className={classes.buttonIcon} /> : <i className={`fa fa-save ${classes.buttonIcon}`} />}
            </Box>
            Enregistrer
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

    const loadingTemplate = async () => {
        if (template.current_template !== '' && template.current_template.value !== undefined) {
            const result = await apiClient.get(`/v3/email_templates/${template.current_template.value}`);
            setContent({ ...content, ...{ design: JSON.parse(result.content), externalUpdate: true } });
        }
    };

    useEffect(() => {
        if (template.current_template !== '' && template.current_template.value !== template.current_template.label) {
            loadingTemplate();
        }
    }, [template.current_template]);

    useEffect(() => {
        loadTemplates();
    }, []);

    return (
        <Grid container>
            <Grid item xs={8}>
                <Autocomplete
                    className={classes.templateSelect}
                    classes={{ popper: classes.popper }}
                    size="small"
                    noOptionsText="Aucun template"
                    options={optselect.options}
                    getOptionLabel={(option) => option.label}
                    value={template.current_template}
                    onChange={handleSelectChange}
                    renderInput={(params) => <TextField {...params} label="Template" variant="outlined" />}
                />
            </Grid>
            {/* <CreatableSelect
                    className={classes.templateSelect}
                    isClearable
                    onChange={handleSelectChange}
                    options={optselect.options}
                    noOptionsMessage={() => 'Aucun template'}
                    formatCreateLabel={(inputValue) => `Créer ${inputValue}`}
                    value={template.current_template}
                    placeholder="Template"
                /> */}
            <Grid item xs={4}>
                {saveButton}
            </Grid>
        </Grid>
    );
};

export default TemplateSelect;
