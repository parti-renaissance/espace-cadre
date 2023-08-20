import PropTypes from 'prop-types'
import { UIChip } from 'ui/Card'
import { styled } from '@mui/system'
import { Typography } from '@mui/material'
import { formatDate } from 'shared/helpers'

const UIDate = styled('span')(
  ({ theme }) => `
  color: ${theme.palette.gray600};
  display: flex;
  margin-left: ${theme.spacing(1)};
`
)
const DateTypo = styled(Typography)`
  font-size: 10px;
`

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
`

const messages = {
  active: 'Active',
  inactive: 'Inactive',
}

const Header = ({ status, createdAt }) => (
  <HorizontalContainer>
    <UIChip
      color={status ? 'teal700' : 'red600'}
      bgcolor={status ? 'activeLabel' : 'inactiveLabel'}
      label={status ? messages.active : messages.inactive}
    />
    <UIDate>
      <DateTypo>{formatDate(createdAt, 'dd/MM/yyyy')}</DateTypo>
    </UIDate>
  </HorizontalContainer>
)

Header.propTypes = {
  status: PropTypes.bool.isRequired,
  createdAt: PropTypes.object.isRequired,
}

export default Header
