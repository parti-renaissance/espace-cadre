import PropTypes from 'prop-types'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'
import { UIChip } from '~/ui/Card'
import { styled } from '@mui/system'

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`
const IconContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
`

const NotificationsOnIcon = styled(NotificationsActiveRoundedIcon)(
  ({ theme }) => `
  font-size: 16px;
  font-weight: 500;
  border-radius: 19px;
  padding: ${theme.spacing(0.25)};
  border-color: ${theme.palette.gray100};
  border: ${`1px solid ${theme.palette.gray200}`};
  margin: ${theme.spacing(0.25, 1, 0, 1)};
`
)

const NotificationsOffIcon = styled(NotificationsOffRoundedIcon)(
  ({ theme }) => `
  font-size: 16px;
  font-weight: 500;
  border-radius: 19px;
  padding: ${theme.spacing(0.25)};
  border-color: ${theme.palette.gray100};
  border: 1px solid ${theme.palette.gray200};
  margin: ${theme.spacing(0.25, 0, 0, 1)};
`
)

const messages = {
  published: 'Publiée',
  unpublished: 'Dépubliée',
}

const Header = ({ status, withNotification }) => (
  <HorizontalContainer>
    <IconContainer>
      <UIChip
        color={status ? 'teal700' : 'gray700'}
        bgcolor={status ? 'activeLabel' : 'inactiveLabel'}
        label={status ? messages.published : messages.unpublished}
      />
      {withNotification ? <NotificationsOnIcon sx={{ mr: 1 }} /> : <NotificationsOffIcon sx={{ mr: 1 }} />}
    </IconContainer>
  </HorizontalContainer>
)

Header.propTypes = {
  status: PropTypes.bool.isRequired,
  withNotification: PropTypes.bool.isRequired,
}

export default Header
