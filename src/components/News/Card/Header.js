import PropTypes from 'prop-types'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'
import { UIChip } from 'ui/Card'
import { format } from 'date-fns'
import { styled } from '@mui/system'
import { Typography } from '@mui/material'

const UIDate = styled('span')(
  ({ theme }) => `
  display: flex;
  color: ${theme.palette.gray600};
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

const NotificationsOnIcon = styled(NotificationsActiveRoundedIcon)`
  font-size: 16px;
  font-weight: 500;
  border-radius: 19px;
  padding: ${({ theme }) => theme.spacing(0.25)};
  border-color: ${({ theme }) => theme.palette.gray100};
  border: ${({ theme }) => `1px solid ${theme.palette.gray200}`};
  margin: ${({ theme }) => theme.spacing(0.25, 1, 0, 1)};
`

const NotificationsOffIcon = styled(NotificationsOffRoundedIcon)`
  font-size: 16px;
  font-weight: 500;
  border-radius: 19px;
  padding: ${({ theme }) => theme.spacing(0.25)};
  border-color: ${({ theme }) => theme.palette.gray100};
  border: ${({ theme }) => `1px solid ${theme.palette.gray200}`};
  margin: ${({ theme }) => theme.spacing(0.25, 0, 0, 1)};
`

const messages = {
  published: 'Publiée',
  unpublished: 'Dépubliée',
}

const Header = ({ status, withNotification, createdAt }) => (
  <HorizontalContainer data-testid="news-header">
    <UIChip
      color={status ? 'teal700' : 'red600'}
      bgcolor={status ? 'activeLabel' : 'inactiveLabel'}
      label={status ? messages.published : messages.unpublished}
    />
    {withNotification ? <NotificationsOnIcon sx={{ mr: 1 }} /> : <NotificationsOffIcon sx={{ mr: 1 }} />}
    <UIDate>
      <DateTypo>{format(createdAt, 'dd/MM/yyyy')}</DateTypo>
    </UIDate>
  </HorizontalContainer>
)

Header.propTypes = {
  status: PropTypes.bool.isRequired,
  withNotification: PropTypes.bool.isRequired,
  createdAt: PropTypes.object.isRequired,
}

export default Header
