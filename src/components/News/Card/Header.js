import PropTypes from 'prop-types'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'
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
  published: 'Publiée',
  unpublished: 'Dépubliée',
}

const Header = ({ status, withNotification, createdAt }) => {
  const NotificationIcon = withNotification ? NotificationsActiveRoundedIcon : NotificationsOffRoundedIcon

  return (
    <Horizontal data-testid="news-header">
      <Chip
        color={status ? 'teal700' : 'red600'}
        backgroundColor={status ? 'activeLabel' : 'inactiveLabel'}
        label={status ? messages.published : messages.unpublished}
      />
      <NotificationIcon
        sx={{
          fontSize: '16px',
          fontWeight: '500',
          borderRadius: '19px',
          border: '1px solid gray200',
          mt: 0.25,
          mr: 0,
          mb: 0,
          ml: 1,
          px: 0.25,
          py: 0.25,
        }}
      />
      <UIDate>Le {format(createdAt, 'dd/MM/yyyy')}</UIDate>
    </Horizontal>
  )
}

Header.propTypes = {
  status: PropTypes.bool.isRequired,
  withNotification: PropTypes.bool.isRequired,
  createdAt: PropTypes.object.isRequired,
}

export default Header
