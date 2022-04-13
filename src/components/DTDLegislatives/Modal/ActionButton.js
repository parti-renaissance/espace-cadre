import PropTypes from 'prop-types'
import Button from 'ui/Button'
import Loader from 'ui/Loader'

const messages = {
  create: 'Créer et cibler',
  submitButton: 'Cibler',
}

const ActionButton = ({ shouldDisplayRegister, isStepOneValid, handleSubmit, isCampaignLoading }) => {
  if (shouldDisplayRegister) {
    return (
      <Button
        type="submit"
        rootProps={{ sx: { color: 'whiteCorner', mr: 4 } }}
        disabled={!isStepOneValid || isCampaignLoading}
        onClick={handleSubmit}
        sx={{ width: '142px' }}
      >
        {isCampaignLoading ? <Loader /> : messages.create}
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
  isCampaignLoading: PropTypes.bool,
  handleSubmit: PropTypes.func,
}
