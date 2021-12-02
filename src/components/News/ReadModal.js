import { Dialog, Paper, Grid, Icon, Typography, Button as MuiButton } from '@mui/material'
import { styled } from '@mui/system'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'
import MuiCloseIcon from '@mui/icons-material/Close'
import PropTypes from 'prop-types'
import DomainNews from 'domain/news'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import EditIcon from '@mui/icons-material/EditRounded'

const StyledPaper = styled(Paper)(
  ({ theme }) => `
  padding: ${theme.spacing(4)};
  width: 664px;
  border-radius: 12px;
`
)

const Title = styled(Typography)(
  ({ theme }) => `
  font-size: 16px;
  font-weight: 400;
  color: ${theme.palette.gray800};
  margin-top: ${theme.spacing(1)};
  width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
)

const Button = styled(MuiButton)(
  ({ theme }) => `
  color: ${theme.palette.orange500};
  background: ${theme.palette.newsBackground};
  border-radius: 8.35px;
  margin-bottom: ${theme.spacing(4)};
  padding: ${theme.spacing(0.75, 1)};
`
)

const CloseIcon = styled(MuiCloseIcon)(
  ({ theme }) => `
  color: ${theme.palette.gray700};
  cursor: pointer;
`
)

const StatusIcon = styled(
  'span',
  shouldForwardProps
)(
  ({ theme, active }) => `
  font-size: 12px;
  font-weight: 500;
  border-radius: 19px;
  padding: ${theme.spacing(0.25, 1)};
  color: ${active ? theme.palette.teal700 : theme.palette.red600};
  background: ${active ? theme.palette.activeLabel : theme.palette.inactiveLabel};
`
)

const DateItem = styled(Grid)(
  ({ theme }) => `
  font-size: 14px;
  margin-top: ${theme.spacing(0.25)};
`
)

const AuthorWrapper = styled(Grid)(
  ({ theme }) => `
  margin-bottom: ${theme.spacing(4)};
`
)

const Author = styled(Grid)(
  ({ theme }) => `
  font-size: 10px;
  color: ${theme.palette.gray600};
  padding: 0;
`
)

const NotificationIcon = styled(Icon)(
  ({ theme }) => `
  padding: ${theme.spacing(0.25, 1)};
  margin: ${theme.spacing(0.25, 0, 0, 0)};
  border: 1px solid ${theme.palette.gray200};
  border-radius: 19px;
  font-size: 14px;
  font-weight: 500;
`
)

const messages = {
  published: 'Publiée',
  unpublished: 'Dépubliée',
  edit: 'Modifier',
  author: 'Par',
}

const ReadModal = ({ news, handleClose, handleOpenEditModal, open }) => {
  if (!news) return null

  return (
    <Dialog open={open} onClose={handleClose} PaperComponent={StyledPaper}>
      <Grid container>
        <Title title={news.title}>{news.title}</Title>
        <Button onClick={handleOpenEditModal} sx={{ ml: 'auto', mr: 1 }}>
          <EditIcon sx={{ mr: 1 }} />
          {messages.edit}
        </Button>
        <CloseIcon onClick={handleClose} sx={{ mt: 0.75 }} />
      </Grid>
      <Grid container spacing={1}>
        <Grid item>
          <StatusIcon active={news.status}>{news.status ? messages.published : messages.unpublished}</StatusIcon>
        </Grid>
        <Grid item>
          {news?.withNotification && <NotificationIcon component={NotificationsActiveRoundedIcon} />}
          {!news?.withNotification && <NotificationIcon component={NotificationsOffRoundedIcon} />}
        </Grid>
        <DateItem item>{new Date(news.createdAt).toLocaleDateString()}</DateItem>
      </Grid>
      <AuthorWrapper container>
        <Author item>{`${messages.author} ${news.creator}`}</Author>
      </AuthorWrapper>
      <Grid container>
        <Grid item xs={12}>
          <Typography sx={{ fontSize: '12px' }}>{news.body}</Typography>
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default ReadModal

ReadModal.defaultProps = {
  handleClose: () => {},
  onSubmitRefresh: () => {},
}

ReadModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  onSubmitRefresh: PropTypes.func.isRequired,
  handleOpenEditModal: PropTypes.func.isRequired,
  news: DomainNews.propTypes,
  open: PropTypes.bool.isRequired,
}
