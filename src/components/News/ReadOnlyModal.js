import { Dialog, Grid, Icon, Paper, Typography as MuiTypography } from '@mui/material'
import { styled } from '@mui/system'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'
import PropTypes from 'prop-types'
import DomainNews from 'domain/news'
import { shouldForwardProps } from 'components/shared/notification/helpers'
import Modal from 'ui/Modal'

const Title = styled(MuiTypography)(
  ({ theme }) => `
  font-size: 16px;
  font-weight: 400;
  color: ${theme.palette.gray800};
  margin-top: ${theme.spacing(1)};
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

const Text = styled(MuiTypography)(
  () => `
  font-size: 12px;
`
)

const messages = {
  published: 'Publiée',
  unpublished: 'Dépubliée',
  author: 'Par',
}

const ReadOnlyModal = ({ news, handleClose, open }) => {
  if (!news) return null

  return (
    <Modal open={open} onClose={handleClose}>
      <Grid container justifyContent="space-between" sx={{ marginBottom: 4 }}>
        <Grid item xs={8}>
          <Title>{news.title}</Title>
        </Grid>
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
          <Text>{news.body}</Text>
        </Grid>
      </Grid>
    </Modal>
  )
}

export default ReadOnlyModal

ReadOnlyModal.defaultProps = {
  handleClose: () => {},
  onSubmitRefresh: () => {},
  news: null,
}

ReadOnlyModal.propTypes = {
  handleClose: PropTypes.func,
  onSubmitRefresh: PropTypes.func,
  news: DomainNews.propTypes,
  open: PropTypes.bool.isRequired,
}
