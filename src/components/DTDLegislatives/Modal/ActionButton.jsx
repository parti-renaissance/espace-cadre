import PropTypes from 'prop-types'
import Button from '~/ui/Button'
import Loader from '~/ui/Loader'

const messages = {
  create: 'Créer et cibler',
  target: 'Cibler',
}

const ActionButton = ({ shouldDisplayRegister, isStepOneValid, handleSubmit, isCampaignLoading, isInCreationMode }) => {
  if (shouldDisplayRegister) {
    return (
      <Button
        type="submit"
        disabled={!isStepOneValid || isCampaignLoading}
        onClick={handleSubmit}
        sx={{ width: 'auto', color: 'whiteCorner' }}
      >
        {isCampaignLoading && <Loader />}&nbsp;
        {isInCreationMode ? messages.create : messages.target}
      </Button>
    )
  }
  return (
    <Button type="submit" onClick={handleSubmit} sx={{ color: 'whiteCorner' }}>
      {messages.target}
    </Button>
  )
}

export default ActionButton

ActionButton.propTypes = {
  shouldDisplayRegister: PropTypes.bool,
  isStepOneValid: PropTypes.bool,
  isCampaignLoading: PropTypes.bool,
  handleSubmit: PropTypes.func,
  isInCreationMode: PropTypes.bool,
}
