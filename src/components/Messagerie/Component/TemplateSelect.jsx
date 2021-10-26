/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import {
    Grid, Button, Box, makeStyles, createStyles,
} from '@material-ui/core';
import { apiClient } from '../../../services/networking/client';
import { useMessageTemplate, useSelectedTemplate } from '../../../redux/messagerie/hooks';

const useStyles = makeStyles((theme) => createStyles({
    autocomplete: {
        border: `1px solid ${theme.palette.gray200}`,
        borderRadius: '8px',
        marginRight: '16px',
    },
    popper: {
        border: `1px solid ${theme.palette.gray200}`,
        borderRadius: '8px',
        marginTop: '8px',
    },
    templateSelect: {
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
}));

const TemplateSelect = () => {
    const [options, setOptions] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useSelectedTemplate();
    const [messageTemplate] = useMessageTemplate();
    const [buttonDisabled, setButtonDisabled] = useState(selectedTemplate === null);

    const classes = useStyles();

    const handleSelectChange = (selected, action) => {
        switch (action.action) {
        case 'select-option':
        case 'clear': {
            setSelectedTemplate(selected);
            break;
        }
        case 'create-option': {
            const newOption = { label: selected.label, value: null, isNew: true };
            setOptions((prevState) => prevState.concat([newOption]));
            setSelectedTemplate(newOption);
            setButtonDisabled(false);
            break;
        }
        default:
        }
    };

    const createTemplate = async (bodyreq) => apiClient.post('/v3/email_templates', bodyreq);
    const updateTemplate = async (bodyreq, id) => apiClient.put(`/v3/email_templates/${id}`, bodyreq);

    const handleClickSaveButton = async () => {
        const bodyreq = {
            label: selectedTemplate.label,
            content: JSON.stringify(messageTemplate.design),
        };

        if (selectedTemplate.value) {
            await updateTemplate(bodyreq, selectedTemplate.value);
        } else {
            const templateStatusResponse = await createTemplate(bodyreq);

            if (templateStatusResponse.uuid) {
                setOptions(options.map((option) => {
                    if (option.isNew) {
                        return {
                            label: option.label,
                            value: templateStatusResponse.uuid,
                        };
                    }

                    return option;
                }));

                setSelectedTemplate({
                    label: selectedTemplate.label,
                    value: templateStatusResponse.uuid,
                });
            }
        }
    };

    // Get saved templates
    useEffect(() => {
        if (options.length) {
            return;
        }

        const loadTemplates = async () => {
            const result = await apiClient.get('/v3/email_templates');

            setOptions((prevState) => prevState.concat(result.items.map((item) => ({ label: item.label, value: item.uuid }))));
        };
        loadTemplates();
    }, [options]);

    return (
        <Grid container>
            <Grid item xs={8}>
                <CreatableSelect
                    className={classes.templateSelect}
                    isClearable
                    onChange={handleSelectChange}
                    options={options}
                    formatOptionLabel={(option) => `${option.label}${option.isNew ? ' (brouillon)' : ''}`}
                    getOptionLabel={(option) => `${option.label}${option.isNew ? ' (brouillon)' : ''}`}
                    noOptionsMessage={() => 'Aucun template'}
                    formatCreateLabel={(inputValue) => `Créer ${inputValue}`}
                    defaultValue={selectedTemplate}
                    placeholder="Template"
                />
            </Grid>
            <Grid item xs={4}>
                <Button
                    variant="outlined"
                    size="medium"
                    className={classes.materialButton}
                    disabled={buttonDisabled}
                    onClick={handleClickSaveButton}
                >
                    <Box><i className={`fa fa-save ${classes.buttonIcon}`} /></Box>
                    Enregistrer
                </Button>
            </Grid>
        </Grid>
    );
};

export default TemplateSelect;
