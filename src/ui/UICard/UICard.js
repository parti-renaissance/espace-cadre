import { Box, Button, Grid, Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import NewsObject from 'domain/news'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'
import { News, Ripostes } from '../../route'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    borderRadius: '8.35px',
  },
  container: {
    marginBottom: theme.spacing(1),
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
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.palette.gray900,
    width: '400px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  creator: {
    fontSize: '12px',
    fontWeight: '400',
    color: theme.palette.gray600,
  },
  KpiContainer: {
    marginBottom: theme.spacing(2.5),
  },
  buttonContainer: {
    position: 'relative',
    bottom: '0',
  },
  editButton: {
    fontSize: '13px',
    fontWeight: '500',
    color: type => (type.type === News ? theme.palette.orange500 : theme.palette.teal700),
    marginTop: theme.spacing(1.25),
    '&:hover': {
      background: type => (type.type === News ? theme.palette.newsBackground : theme.palette.riposteBackground),
      borderRadius: '8.35px',
    },
  },
}))

const messages = {
  riposteActive: 'Active',
  riposteInactive: 'Inactive',
  newsPublished: 'Publiée',
  newsunPublished: 'Dépubliée',
}

const UICard = ({ element, handleClickOpen, type }) => {
  const classes = useStyles({ type })
  const NotificationIcon = element.withNotification ? NotificationsActiveRoundedIcon : NotificationsOffRoundedIcon

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Paper classes={{ root: classes.root }}>
        <Grid container className={classes.container}>
          <Grid item>
            {element.status ? (
              <span className={`${classes.chip} ${classes.active}`}>
                {type === News ? messages.newsPublished : messages.riposteActive}
              </span>
            ) : (
              <span className={`${classes.chip} ${classes.inactive}`}>
                {type === News ? messages.newsunPublished : messages.riposteInactive}
              </span>
            )}
          </Grid>
          {type === News && (
            <Grid item>
              <NotificationIcon className={`${classes.chip} ${classes.withBorder} ${classes.icon}`} />
            </Grid>
          )}
          <Grid item className={classes.date}>
            Le {new Date(element.createdAt).toLocaleDateString()}
          </Grid>
        </Grid>
        <Grid container className={classes.container}>
          <Grid item className={classes.title} title={element.title}>
            {element.title}
          </Grid>
          <Grid item className={classes.creator}>
            Par {element.creator}
          </Grid>
        </Grid>
        {type === Ripostes && (
          <>
            <Grid container spacing={1} className={classes.KpiContainer}>
              <Grid item>
                <NotificationIcon className={`${classes.chip} ${classes.withBorder} ${classes.icon}`} />
              </Grid>
              <Grid item>
                <Box className={`${classes.chip} ${classes.withBorder}`}>
                  {element.views} vue{element.views > 1 && 's'}
                </Box>
              </Grid>
              <Grid item>
                <Box className={`${classes.chip} ${classes.withBorder}`}>
                  {element.detailViews} vue{element.detailViews > 1 && 's'} détaillée{element.detailViews > 1 && 's'}
                </Box>
              </Grid>
              <Grid item>
                <Box className={`${classes.chip} ${classes.withBorder}`}>
                  {element.ripostes} riposte{element.ripostes > 1 && 's'}
                </Box>
              </Grid>
            </Grid>
          </>
        )}
        {type === Ripostes && (
          <Grid container justifyContent="space-between" className={classes.buttonContainer}>
            <Grid item>
              <Button className={classes.editButton} onClick={() => handleClickOpen(element.id)}>
                {type === News ? 'Voir' : 'Éditer'}
              </Button>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Grid>
  )
}

export default UICard

UICard.defaultProps = {
  handleClickOpen: () => {},
  toggleStatus: () => {},
}

UICard.propTypes = {
  element: NewsObject.propTypes.isRequired,
  handleClickOpen: PropTypes.func,
  type: PropTypes.string.isRequired,
}
