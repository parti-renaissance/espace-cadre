import UIContainer from '~/ui/Container'
import ErrorComponent from '~/components/ErrorComponent'
import PropTypes from 'prop-types'

const Error = ({ message }) => (
  <UIContainer sx={{ alignItems: 'center', justifyContent: 'center' }}>
    <ErrorComponent errorMessage={{ message }} />
  </UIContainer>
)

Error.propTypes = {
  message: PropTypes.string.isRequired,
}

export default Error
