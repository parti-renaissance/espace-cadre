import PropTypes from 'prop-types'
import { Chip } from 'ui/Card'
import { format } from 'date-fns'
import { styled } from '@mui/system'
import { Typography } from '@mui/material'

const UIDate = styled('span')(
  ({ theme }) => `
  color: ${theme.palette.gray600};
  padding: ${theme.spacing(1)};
`
)
const DateTypo = styled(Typography)`
  font-size: 10px;
`

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
`

const messages = {
  active: 'Active',
  inactive: 'Inactive',
}

const Header = ({ status, createdAt }) => (
  <HorizontalContainer>
    <Chip
      color={status ? 'teal700' : 'red600'}
      backgroundColor={status ? 'activeLabel' : 'inactiveLabel'}
      label={status ? messages.active : messages.inactive}
    />
    <UIDate>
      <DateTypo>Le {format(createdAt, 'dd/MM/yyyy')}</DateTypo>
    </UIDate>
  </HorizontalContainer>
)

Header.propTypes = {
  status: PropTypes.bool.isRequired,
  createdAt: PropTypes.object.isRequired,
}

export default Header
