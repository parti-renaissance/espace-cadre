import PropTypes from 'prop-types'

import { SurveyItemZone as DomainSurveyItemZone } from '~/domain/surveys'
import { FormError } from '~/components/shared/error/components'
import SelectOption from './shared/components/SelectOption'
import UIInputLabel from '~/ui/InputLabel/InputLabel'
import UIInput from '~/ui/Input/Input'
import { Select } from './shared/components/styled'
import { fields } from './shared/constants'

const messages = {
  title: {
    label: 'Titre',
    validationRule: '(70 caractères)',
    placeholder: 'Il identifiera votre questionnaire auprès des militants',
  },
  territory: {
    label: 'Territoire',
  },
}

const initialValues = {
  title: '',
}

const CreateEditTitleAndTerritory = ({
  formValues = initialValues,
  updateFormField,
  errors = [],
  isZoneSelectable,
}) => (
  <>
    <UIInputLabel data-cy="surveys-create-edit-title-label" sx={{ pt: 4, pb: 1 }}>
      {messages.title.label}
    </UIInputLabel>
    <UIInput
      data-cy="surveys-create-edit-title-input"
      name={fields.title}
      placeholder={messages.title.placeholder}
      value={formValues.title}
      onChange={event => {
        updateFormField(event.target.name, event.target.value)
      }}
      autoFocus
    />
    <FormError errors={errors} field="name" />

    {formValues.zone && (
      <>
        <UIInputLabel data-cy="surveys-create-edit-territory-label" sx={{ pt: 4, pb: 1 }}>
          {messages.territory.label}
        </UIInputLabel>
        <Select
          data-cy="surveys-create-edit-territory-input"
          name={fields.zone}
          value={formValues.zone}
          onChange={event => {
            updateFormField(fields.zone, event.target.value)
          }}
          renderValue={value => `${value.name} ${value.code ? `(${value.code})` : ''}`}
          disabled={!isZoneSelectable}
          displayEmpty
        >
          <SelectOption
            key={formValues.zone?.id}
            label={`${formValues.zone?.name ? ` (${formValues.zone.name})` : ''} ${
              formValues.zone?.code ? ` (${formValues.zone.code})` : ''
            }`}
            value={formValues.zone ?? ''}
          />
        </Select>
      </>
    )}
  </>
)

CreateEditTitleAndTerritory.propTypes = {
  formValues: PropTypes.shape({
    title: PropTypes.string.isRequired,
    zone: PropTypes.shape(DomainSurveyItemZone.propTypes),
  }),
  updateFormField: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string,
      message: PropTypes.string,
    })
  ),
  isZoneSelectable: PropTypes.bool.isRequired,
}

export default CreateEditTitleAndTerritory
