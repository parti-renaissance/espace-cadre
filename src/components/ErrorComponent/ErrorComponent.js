import PropTypes from 'prop-types'
import UIContainer from 'ui/Container'
import { styled } from '@mui/system'

const Container = styled(UIContainer)(
  ({ theme }) => `
  color: ${theme.palette.statusError};
  text-align: center;
  width: 100%;
  margin-bottom: ${theme.spacing(2)};
  padding: ${theme.spacing(2)};
  border-radius: 6px,
  `
)

const ErrorComponent = ({ errorMessage }) => <Container>{errorMessage?.message}</Container>

ErrorComponent.propTypes = {
  errorMessage: PropTypes.shape({
    message: PropTypes.string,
  }),
}

export default ErrorComponent
