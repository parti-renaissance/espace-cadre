import PropTypes from 'prop-types'
import Chip from 'ui/Card/Chip/Chip'
import { format } from 'date-fns'
import { styled } from '@mui/system'

const UIDate = styled('span')(
  ({ theme }) => `
  font-size: 10px;
  color: ${theme.palette.gray600};
  padding: ${theme.spacing(1)};
`
)

const Horizontal = styled('div')`
  display: flex;
  flex-direction: row;
  flex: 1;
`

const messages = {
  active: 'Active',
  inactive: 'Inactive',
}

const Header = ({ status, createdAt }) => (
  <Horizontal>
    <Chip
      color={status ? 'teal700' : 'red600'}
      backgroundColor={status ? 'activeLabel' : 'inactiveLabel'}
      label={status ? messages.active : messages.inactive}
    />
    <UIDate>Le {format(createdAt, 'dd/MM/yyyy')}</UIDate>
  </Horizontal>
)

Header.propTypes = {
  status: PropTypes.bool.isRequired,
  createdAt: PropTypes.object.isRequired,
}

export default Header
