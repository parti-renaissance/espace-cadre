import { useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { Grid, Button, Box } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'
import { apiClient } from '../../../services/networking/client'
import { useSelectedTemplate } from '../../../redux/messagerie/hooks'

const useStyles = makeStyles(theme =>
  createStyles({
    popper: {
      border: `1px solid ${theme.palette.gray200}`,
      borderRadius: '8px',
      marginTop: theme.spacing(1),
    },
    templateSelect: {
      borderRadius: '8px',
      marginRight: theme.spacing(2),
    },
    materialButton: {
      color: theme.palette.blue600,
      borderColor: theme.palette.blue600,
      width: '100%',
      padding: theme.spacing(1, 2),
      borderRadius: '8px',
      '&:hover': {
        background: theme.palette.gray200,
      },
    },
    buttonIcon: {
      marginRight: theme.spacing(1),
    },
  })
)

const TemplateSelect = () => {
  const [options, setOptions] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useSelectedTemplate()
  const [buttonDisabled, setButtonDisabled] = useState(selectedTemplate === null)

  const classes = useStyles()

  useEffect(() => {
    const loadTemplates = async () => {
      const result = await apiClient.get('/v3/email_templates')
      setOptions(prevState => prevState.concat(result.items.map(item => ({ label: item.label, value: item.uuid }))))
    }
    loadTemplates()
  }, [])

  const handleSelectChange = (selected, action) => {
    switch (action.action) {
      case 'select-option':
      case 'clear': {
        setSelectedTemplate(selected)
        break
      }
      case 'create-option': {
        const newOption = { label: selected.label, value: null, isNew: true }
        setOptions(prevState => prevState.concat([newOption]))
        setSelectedTemplate(newOption)
        setButtonDisabled(false)
        break
      }
      default:
    }
  }

  const createTemplate = bodyreq => apiClient.post('/v3/email_templates', bodyreq)
  const updateTemplate = (bodyreq, id) => apiClient.put(`/v3/email_templates/${id}`, bodyreq)

  const handleClickSaveButton = async () => {
    const bodyreq = {
      label: selectedTemplate.label,
      content: null,
    }

    if (selectedTemplate.value) {
      await updateTemplate(bodyreq, selectedTemplate.value)
    } else {
      const templateStatusResponse = await createTemplate(bodyreq)

      if (templateStatusResponse.uuid) {
        setOptions(
          options.map(option => {
            if (option.isNew) {
              return {
                label: option.label,
                value: templateStatusResponse.uuid,
              }
            }

            return option
          })
        )

        setSelectedTemplate({
          label: selectedTemplate.label,
          value: templateStatusResponse.uuid,
        })
      }
    }
  }

  return (
    <Grid container>
      <Grid item xs={8}>
        <CreatableSelect
          className={classes.templateSelect}
          isClearable
          onChange={handleSelectChange}
          options={options}
          formatOptionLabel={option => `${option.label}${option.isNew ? ' (brouillon)' : ''}`}
          getOptionLabel={option => `${option.label}${option.isNew ? ' (brouillon)' : ''}`}
          noOptionsMessage={() => 'Aucun template'}
          formatCreateLabel={inputValue => `Créer ${inputValue}`}
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
          <Box>
            <i className={`fa fa-save ${classes.buttonIcon}`} />
          </Box>
          Enregistrer
        </Button>
      </Grid>
    </Grid>
  )
}

export default TemplateSelect
