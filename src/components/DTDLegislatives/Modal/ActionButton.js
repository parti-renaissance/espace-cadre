import Button from 'ui/Button'
import PropTypes from 'prop-types'

const messages = {
  nextButton: 'Créer et cibler',
  submitButton: 'créer la campagne',
}

const ActionButton = ({ shouldDisplayRegister, isStepOneValid, isStepTwoValid, handleSubmit, next }) => {
  if (shouldDisplayRegister) {
    return (
      <Button
        type="submit"
        onClick={next}
        rootProps={{ sx: { color: 'whiteCorner', mr: 4 } }}
        disabled={!isStepOneValid}
      >
        {messages.nextButton}
      </Button>
    )
  }
  // return (
  //   <Button
  //     type="submit"
  //     onClick={handleSubmit}
  //     rootProps={{ sx: { color: 'whiteCorner', mr: 4 } }}
  //     disabled={!isStepTwoValid}
  //   >
  //     {messages.submitButton}
  //   </Button>
  // )
}

export default ActionButton

ActionButton.propTypes = {
  shouldDisplayRegister: PropTypes.bool,
  isStepOneValid: PropTypes.bool,
  isStepTwoValid: PropTypes.bool,
  handleSubmit: PropTypes.func,
  next: PropTypes.func,
}
