import PropTypes from 'prop-types'
import UIContainer from '~/ui/Container'

const ErrorComponent = ({ errorMessage }) => (
  <UIContainer
    rootProps={{
      sx: {
        color: 'statusError',
        textAlign: 'center',
        width: '100%',
        mb: 2,
        p: 2,
        borderRadius: '8px',
      },
    }}
  >
    {errorMessage?.message}
  </UIContainer>
)

ErrorComponent.propTypes = {
  errorMessage: PropTypes.shape({
    message: PropTypes.string,
  }),
}

export default ErrorComponent
