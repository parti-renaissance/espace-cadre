import Button from 'ui/Button'
import PropTypes from 'prop-types'

const messages = {
  create: 'Créer et cibler',
  submitButton: 'Cibler',
}

const ActionButton = ({ shouldDisplayRegister, isStepOneValid, handleSubmit }) => {
  if (shouldDisplayRegister) {
    return (
      <Button
        type="submit"
        rootProps={{ sx: { color: 'whiteCorner', mr: 4 } }}
        disabled={!isStepOneValid}
        onClick={handleSubmit}
      >
        {messages.create}
      </Button>
    )
  }
  return (
    <Button type="submit" onClick={handleSubmit} rootProps={{ sx: { color: 'whiteCorner', mr: 4 } }}>
      {messages.submitButton}
    </Button>
  )
}

export default ActionButton

ActionButton.propTypes = {
  shouldDisplayRegister: PropTypes.bool,
  isStepOneValid: PropTypes.bool,
  handleSubmit: PropTypes.func,
}
