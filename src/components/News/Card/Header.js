import PropTypes from 'prop-types'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'
import { UIChip } from 'ui/Card'
import { styled } from '@mui/system'
import BookmarkIcon from '@mui/icons-material/Bookmark'

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

const Header = ({ status, pinned, withNotification }) => (
  <HorizontalContainer data-testid="news-header">
    <IconContainer>
      <UIChip
        color={status ? 'teal700' : 'gray700'}
        bgcolor={status ? 'activeLabel' : 'inactiveLabel'}
        label={status ? messages.published : messages.unpublished}
      />
      {withNotification ? <NotificationsOnIcon sx={{ mr: 1 }} /> : <NotificationsOffIcon sx={{ mr: 1 }} />}
    </IconContainer>
    {pinned && <BookmarkIcon sx={{ color: 'main', fontSize: '14px' }} />}
  </HorizontalContainer>
)

Header.propTypes = {
  status: PropTypes.bool.isRequired,
  pinned: PropTypes.bool.isRequired,
  withNotification: PropTypes.bool.isRequired,
}

export default Header
