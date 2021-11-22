import { Dialog, Grid, Button } from '@mui/material'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import DomainNews from 'domain/news'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(4),
    width: '664px',
    borderRadius: '12px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '400',
    color: theme.palette.gray800,
    marginTop: theme.spacing(1),
  },
  buttonContainer: {
    background: theme.palette.newsBackground,
    borderRadius: '8.35px',
    marginBottom: theme.spacing(4),
  },
  editButton: {
    color: theme.palette.orange500,
    padding: theme.spacing(0.75, 1),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  chip: {
    fontSize: '10px',
    fontWeight: '500',
    borderRadius: '19px',
    padding: theme.spacing(0.25, 1),
  },
  withBorder: {
    border: `1px solid ${theme.palette.gray200}`,
  },
  icon: {
    fontSize: '16px',
    margin: theme.spacing(0.25, 0, 0, 1),
  },
  active: {
    color: theme.palette.teal700,
    background: theme.palette.activeLabel,
    borderRadius: '19px',
  },
  inactive: {
    color: theme.palette.red600,
    background: theme.palette.inactiveLabel,
  },
  date: {
    fontSize: '10px',
    color: theme.palette.gray600,
    padding: theme.spacing(1),
  },
}))

const messages = {
  edit: 'Modifier',
  published: 'Publiée',
  unpublished: 'Dépubliée',
}

const NewsDetailsModal = ({ news, handleClose, open }) => {
  const classes = useStyles()
  const NotificationIcon = news?.withNotification ? NotificationsActiveRoundedIcon : NotificationsOffRoundedIcon

  return (
    news && (
      <Dialog open={open} onClose={handleClose} classes={{ paper: classes.paper }}>
        <Grid container justifyContent="space-between">
          <Grid item className={classes.title}>
            {news.title}
          </Grid>
          <Grid item className={classes.buttonContainer}>
            <Button className={classes.editButton}>
              <EditRoundedIcon className={classes.icon} />
              {messages.edit}
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item>
            <span className={`${classes.chip} ${news.status ? classes.active : classes.inactive}`}>
              {news.status ? messages.published : messages.unpublished}
            </span>
          </Grid>
          <Grid item>
            <NotificationIcon className={`${classes.chip} ${classes.withBorder} ${classes.icon}`} />
          </Grid>
          <Grid item>Le {new Date(news.createdAt).toLocaleDateString()}</Grid>
        </Grid>
        <Grid container>
          <Grid item className={classes.date}>
            Par {news.creator}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            {news.body}
          </Grid>
        </Grid>
      </Dialog>
    )
  )
}

export default NewsDetailsModal

NewsDetailsModal.defaultProps = {
  handleClose: () => {},
  onSubmitRefresh: () => {},
  news: null,
}

NewsDetailsModal.propTypes = {
  handleClose: PropTypes.func,
  onSubmitRefresh: PropTypes.func,
  news: DomainNews.propTypes,
  open: PropTypes.bool.isRequired,
}
