import PropTypes from 'prop-types'
import { Dialog, Paper, Grid, Icon as MuiIcon, Typography, Button } from '@mui/material'
import { styled } from '@mui/system'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'
import MuiCloseIcon from '@mui/icons-material/Close'
import DomainNews from 'domain/news'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import EditIcon from '@mui/icons-material/EditRounded'
import { format } from 'date-fns'
import { TruncatedText } from 'components/shared/styled'
import MainButton from 'ui/MainButton'

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(4)};
  width: 586px;
  border-radius: 8px;
`

const HeaderContainer = styled(Grid)`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const StatusIcon = styled(
  'span',
  shouldForwardProps
)(
  ({ theme, active }) => `
  font-size: 10px;
  font-weight: 500;
  line-height: 15px;
  border-radius: 19px;
  margin-right: ${theme.spacing(1)};
  padding: ${theme.spacing(0.25, 1)};
  color: ${active ? theme.palette.green700 : theme.palette.red600};
  background: ${active ? theme.palette.activeLabel : theme.palette.inactiveLabel};
`
)

const NotificationIcon = styled(MuiIcon)(
  ({ theme }) => `
  font-size: 15px;
  padding: ${theme.spacing(0.25, 1)};
  margin-right: ${theme.spacing(1)};
  border: 1px solid ${theme.palette.gray300};
  border-radius: 19px;
`
)

const DateItem = styled(Typography)`
  font-size: 10px;
  font-weight: 400;
  line-height: 15px;
  color: ${({ theme }) => theme.palette.gray600};
`

const CloseIcon = styled(MuiCloseIcon)`
  color: ${({ theme }) => theme.palette.gray700};
  cursor: pointer;
`

const Title = styled(TruncatedText)`
  font-size: 24px;
  font-weight: 400;
  line-height: 28px;
  color: ${({ theme }) => theme.palette.gray800};
  width: 400px;
`

const Author = styled(props => <Typography variant="subtitle2" {...props} />)(
  ({ theme }) => `
  color: ${theme.palette.gray600};
  margin-bottom: ${theme.spacing(2)};
`
)

const Text = styled(Typography)`
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
`

const messages = {
  published: 'Publiée',
  unpublished: 'Dépubliée',
  edit: 'Modifier',
  author: 'Par',
}

const ReadModal = ({ open, news, handleEdit, onCloseResolve }) => {
  const Icon = news?.withNotification ? NotificationsActiveRoundedIcon : NotificationsOffRoundedIcon

  if (!news) return null

  const handleClose = () => {
    onCloseResolve()
  }

  return (
    <Dialog open={open} onClose={handleClose} PaperComponent={StyledPaper} data-testid="news-read-only-modal">
      <HeaderContainer container>
        <StatusIcon active={news?.status}>{news?.status ? messages.published : messages.unpublished}</StatusIcon>
        <NotificationIcon component={Icon} />
        <DateItem>{format(news?.createdAt || new Date(), 'dd/MM/yyyy')}</DateItem>
        <MainButton
          handleClick={handleEdit}
          rootProps={{
            sx: {
              margin: theme => theme.spacing('auto', 1, 'auto', 'auto'),
              padding: theme => theme.spacing(0.75, 1),
            },
          }}
        >
          <EditIcon sx={{ mr: 1 }} />
          {messages.edit}
        </MainButton>
        <CloseIcon onClick={handleClose} data-testid="close-icon" />
      </HeaderContainer>

      <Title title={news?.title}>{news?.title}</Title>
      <Author>{`${messages.author} ${news?.creator}`}</Author>

      <Text sx={{ fontSize: '12px' }}>{news?.body}</Text>
    </Dialog>
  )
}

export default ReadModal

ReadModal.defaultProps = {
  onCloseResolve: () => {},
}

ReadModal.propTypes = {
  open: PropTypes.bool.isRequired,
  news: DomainNews.propTypes,
  handleEdit: PropTypes.func.isRequired,
  onCloseResolve: PropTypes.func,
}
