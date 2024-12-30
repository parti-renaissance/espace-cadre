import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Grid, Icon as MuiIcon, Typography } from '@mui/material'
import { styled } from '@mui/system'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'
import MuiCloseIcon from '@mui/icons-material/Close'
import DomainNews from '~/domain/news'
import { shouldForwardProps } from '~/components/shared/shouldForwardProps'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import EditIcon from '@mui/icons-material/EditRounded'
import PersonIcon from '@mui/icons-material/Person'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { TruncatedText } from '~/components/shared/styled'
import Button from '~/ui/Button'
import Dialog from '~/ui/Dialog'
import ReactMarkdown from 'react-markdown'
import ReadCTA from './ReadCTA'
import { CTA_MODE_PUBLICATION } from './constants'
import { formatDate } from '~/shared/helpers'

const HeaderContainer = styled(Grid)`
  align-items: center;
  justify-content: space-between;
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

const DateItem = styled(Typography)(
  ({ theme }) => `
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${theme.palette.gray600};
`
)

const CloseIcon = styled(MuiCloseIcon)`
  color: ${({ theme }) => theme.palette.gray700};
  cursor: pointer;
`

const Title = styled(TruncatedText)(
  ({ theme }) =>
    `
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
  color: ${theme.palette.gray800}
  width: 400px;
`
)

const Author = styled(Typography)(
  ({ theme }) => `
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${theme.palette.gray600};
  margin-right: ${theme.spacing(1)}
`
)

const UserTimeContainer = styled(Grid)(
  () => `
  display: flex;
  align-items: center;
`
)

const messages = {
  published: 'Publiée',
  unpublished: 'Dépubliée',
  edit: 'Modifier',
}

const ReadModal = ({ open, news, handleEdit, onCloseResolve }) => {
  const Icon = news?.withNotification ? NotificationsActiveRoundedIcon : NotificationsOffRoundedIcon
  const { isMobile } = useCurrentDeviceType()
  const isPublished = useMemo(() => !!news?.status, [news])

  if (!news) {
    return null
  }

  const handleClose = () => {
    onCloseResolve()
  }

  return (
    <Dialog open={open} handleClose={handleClose} data-testid="news-read-only-modal">
      <HeaderContainer container sx={{ mt: isMobile ? 2 : 0 }}>
        <Button onClick={handleEdit} isMainButton>
          <EditIcon />
          {messages.edit}
        </Button>

        <CloseIcon onClick={handleClose} data-testid="close-icon" />
      </HeaderContainer>
      <Grid sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <StatusIcon active={isPublished}>{isPublished ? messages.published : messages.unpublished}</StatusIcon>
        <NotificationIcon component={Icon} />
      </Grid>
      <Title title={news?.title}>{news?.title}</Title>
      <UserTimeContainer>
        {news?.creator && (
          <>
            <PersonIcon sx={{ mr: 0.5, color: 'gray600', fontSize: '12px' }} />
            <Author>{`${news?.creator?.first_name} ${news?.creator?.last_name}`}</Author>
          </>
        )}
        <AccessTimeIcon sx={{ mr: 0.5, color: 'gray600', fontSize: '12px' }} />
        <DateItem>
          {news?.createdAt && `Le ${formatDate(news.createdAt, 'dd/MM/yyyy')} à ${formatDate(news.createdAt, 'HH:mm')}`}
        </DateItem>
      </UserTimeContainer>
      <ReactMarkdown>{news?.body}</ReactMarkdown>
      <Grid>
        <ReadCTA news={news} />
        <ReadCTA mode={CTA_MODE_PUBLICATION} news={news} handleClose={handleClose} />
      </Grid>
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
