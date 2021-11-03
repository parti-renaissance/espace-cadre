import { Box, Button, createStyles, Grid, makeStyles, Paper } from '@material-ui/core'
import PropTypes from 'prop-types'
import RiposteObject from 'domain/riposte'
import RiposteEnableStatus from './RiposteEnableStatus'

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      padding: '16px',
      borderRadius: '8.35px',
    },
    container: {
      marginBottom: '8px',
    },
    chip: {
      fontSize: '10px',
      fontWeight: '500',
      borderRadius: '19px',
      padding: '2px 8px',
    },
    withBorder: {
      border: `1px solid ${theme.palette.gray200}`,
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
      padding: '7px 8px',
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
      marginBottom: '20px',
    },
    buttonContainer: {
      position: 'relative',
      bottom: '0',
    },
    editButton: {
      fontSize: '13px',
      fontWeight: '500',
      color: theme.palette.teal700,
      marginTop: '11px',
      '&:hover': {
        background: theme.palette.riposteBackground,
        borderRadius: '8.35px',
      },
    },
  })
)

const Riposte = ({ riposte, handleClickOpen, toggleEnabled }) => {
  const classes = useStyles()

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Paper classes={{ root: classes.root }}>
        <Grid container className={classes.container}>
          <Grid item>
            {riposte.enabled ? (
              <span className={`${classes.chip} ${classes.active}`}>Active</span>
            ) : (
              <span className={`${classes.chip} ${classes.inactive}`}>Inactive</span>
            )}
          </Grid>
          <Grid item className={classes.date}>
            Le {new Date(riposte.createdAt).toLocaleDateString()}
          </Grid>
        </Grid>
        <Grid container className={classes.container}>
          <Grid item className={classes.title} title={riposte.title}>
            {riposte.title}
          </Grid>
          <Grid item className={classes.creator}>
            Par {riposte.creator}
          </Grid>
        </Grid>
        <Grid container spacing={1} className={classes.KpiContainer}>
          <Grid item>
            {riposte.withNotification ? (
              <Box className={`${classes.chip} ${classes.withBorder}`}>
                <i className="fas fa-bell" />
              </Box>
            ) : (
              <Box className={`${classes.chip} ${classes.withBorder}`}>
                <i className="fas fa-bell-slash" />
              </Box>
            )}
          </Grid>
          <Grid item>
            <Box className={`${classes.chip} ${classes.withBorder}`}>
              {riposte.views} vue{riposte.views > 1 && 's'}
            </Box>
          </Grid>
          <Grid item>
            <Box className={`${classes.chip} ${classes.withBorder}`}>
              {riposte.detailViews} vue{riposte.detailViews > 1 && 's'} détaillée{riposte.detailViews > 1 && 's'}
            </Box>
          </Grid>
          <Grid item>
            <Box className={`${classes.chip} ${classes.withBorder}`}>
              {riposte.ripostes} riposte{riposte.ripostes > 1 && 's'}
            </Box>
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between" className={classes.buttonContainer}>
          <Grid item>
            <Button className={classes.editButton} onClick={() => handleClickOpen(riposte.id)}>
              Éditer
            </Button>
          </Grid>
          <Grid item>
            <RiposteEnableStatus toggleEnabled={toggleEnabled} riposte={riposte} />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}

export default Riposte

Riposte.propTypes = {
  riposte: RiposteObject.propTypes.isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  toggleEnabled: PropTypes.func.isRequired,
}
