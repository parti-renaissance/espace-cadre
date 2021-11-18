import { Grid, Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    borderRadius: '8.35px',
  },
  container: {
    marginBottom: theme.spacing(1),
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
}))

const UICard = ({ header, title, subtitle, children }) => {
  const classes = useStyles()

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Paper classes={{ root: classes.root }}>
        {header}
        <Grid container className={classes.container}>
          <Grid item className={classes.title} title={title}>
            {title}
          </Grid>
          <Grid item className={classes.creator}>
            {subtitle}
          </Grid>
        </Grid>
        {children}
      </Paper>
    </Grid>
  )
}

export default UICard

UICard.propTypes = {
  header: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}
