import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  mentionsLegales: {
    color: theme.palette.mentionsLegales,
    fontSize: '10px',
    position: 'absolute',
    bottom: theme.spacing(2),
  },
  version: {
    margin: theme.spacing(0, 0, 1.25, 4),
  },
  list: {
    paddingLeft: theme.spacing(4),
    '& a': {
      fontWeight: 400,
    },
  },
  signature: {
    margin: theme.spacing(0, 4),
  },
}))

const messages = {
  title: "Je m'engage",
}

function MentionsLegales() {
  const classes = useStyles()

  return (
    <div className={classes.mentionsLegales}>
      <div className={classes.version}>
        {messages.title}@<strong>{process.env.REACT_APP_VERSION}</strong>
      </div>
      <ul className={classes.list}>
        <li>
          <a href="https://donnees.en-marche.fr/">Mes données personnelles</a>
        </li>
        <li>
          <a href="https://en-marche.fr/mentions-legales">Mentions légales</a>
        </li>
        <li>
          <a href="https://en-marche.fr/politique-cookies">Politique de cookies</a>
        </li>
        <li>
          <a href="https://en-marche.fr/politique-protection-donnees">Politique de protection des données</a>
        </li>
        <li>
          <a href="https://www.bkms-system.com/bkwebanon/report/clientInfo?cin=Jp3wHD&c=-1&language=fre">
            Cellule d&apos;alerte
          </a>
        </li>
      </ul>
      <div className={classes.signature}>Designé et assemblé par le Pôle Tech & Innovation</div>
    </div>
  )
}

export default MentionsLegales
