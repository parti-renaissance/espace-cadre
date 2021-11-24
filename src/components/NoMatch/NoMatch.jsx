import { useLocation, Link } from 'react-router-dom'
import { Container, Grid, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  noMatchContainer: {
    textAlign: 'center',
    background: theme.palette.whiteCorner,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    borderRadius: '8.35px',
  },
  text: {
    marginBottom: theme.spacing(2),
  },
  button: {
    background: theme.palette.blueCorner,
    borderRadius: '8.35px',
    padding: theme.spacing(1, 2),
    margin: theme.spacing(0, 'auto'),
  },
  returnHome: {
    color: theme.palette.whiteCorner,
  },
}))

function NoMatch() {
  const classes = useStyles()
  const location = useLocation()

  return (
    <Container className={classes.noMatchContainer}>
      <Grid container>
        <Grid item xs={12} className={classes.text}>
          L&apos;URL recherchée <strong>{location.pathname}</strong> n&apos;existe pas ou vous n&apos;avez pas les
          droits pour y accéder
        </Grid>
        <Grid item xs={12} sm={4} className={classes.button}>
          <Link to="/">
            <Typography variant="body2" className={classes.returnHome}>
              Retournez à l&apos;accueil
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Container>
  )
}

export default NoMatch
