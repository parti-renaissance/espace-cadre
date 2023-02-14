import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import { styled } from '@mui/system'

const UITitle = styled(Typography)(
  ({ theme }) => `
  color: ${theme.palette.colors.gray[900]};
  font-size: 1.525rem;
  line-height: 1.75rem;
  font-weight: 500;
`
)

const Title = ({ title }) => <UITitle>{title}</UITitle>

export default Title

Title.propTypes = {
  title: PropTypes.string.isRequired,
}
