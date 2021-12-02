import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'

import { getAuthorizedPages } from '../../redux/user/selectors'
import Scopes from '../Scopes'
import { NavItem } from 'ui'
import MentionsLegales from 'components/MentionsLegales/MentionsLegales'
import barChart from 'assets/bar-chart.svg'
import pages from 'shared/authorizedPages'
import paths from 'shared/paths'
import icons from 'components/Sidebar/shared/icons'
import colors from 'components/Sidebar/shared/colors'

const useStyles = makeStyles(theme => ({
  sidebar: {
    backgroundColor: theme.palette.whiteCorner,
    minWidth: '17rem',
    width: '17rem',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    transition: 'all 0.4s',
    zIndex: '50',
    boxShadow: '(0 1px 1px 0 rgba(0, 11, 52, 0.12))',
    '&.active': {
      marginLeft: theme.spacing(-34),
    },
    [theme.breakpoints.down('lg')]: {
      marginLeft: theme.spacing(-34),
      '&.active': {
        marginLeft: 0,
      },
    },
  },
  brandLink: {
    textDecoration: 'none',
  },
  logoContainer: {
    display: 'flex',
    margin: theme.spacing(3, 2, 3, 4),
  },
  barChart: {
    color: theme.palette.blue2Corner,
    marginRight: theme.spacing(0.25),
  },
  logoText: {
    color: theme.palette.gray900,
    fontSize: '20px',
    fontWeight: '600',
  },
  beta: {
    color: theme.palette.red500,
    fontSize: '8px',
    height: '12px',
    fontWeight: '500',
    backgroundColor: theme.palette.betaBubble,
    marginLeft: theme.spacing(0.25),
    padding: theme.spacing(0.25, 0.5, 0, 0.5),
    borderRadius: '4px',
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
  },
}))

const messages = {
  title: "Je m'engage",
}

const navInfo = id => ({
  path: paths[id],
  icon: icons[id],
  color: colors[id].color,
  bgcolor: colors[id].bgColor,
})

const Sidebar = ({ toggleSidebar }) => {
  const authorizedPages = useSelector(getAuthorizedPages)
  const classes = useStyles()

  return (
    <>
      <div id="sidebar" className={`${classes.sidebar} ${toggleSidebar ? 'active' : ''}`}>
        <Link to={paths.dashboard} className={classes.brandLink}>
          <div className={classes.logoContainer}>
            <img src={barChart} alt="bar chart" className={classes.barChart} />
            <div className={classes.logoText}>{messages.title}</div>
            <span className={classes.beta}>BÊTA</span>
          </div>
        </Link>
        <Scopes />
        <div className={classes.navMenu}>
          {authorizedPages.includes(pages.dashboard) && <NavItem label="Vue d'ensemble" {...navInfo('dashboard')} />}
          {authorizedPages.includes(pages.adherents) && <NavItem label="Adhérents" {...navInfo('adherents')} />}
          {authorizedPages.includes(pages.messagerie) && <NavItem label="Messagerie" {...navInfo('messagerie')} />}
          {authorizedPages.includes(pages.elections) && <NavItem label="&Eacute;lections" {...navInfo('elections')} />}
          {authorizedPages.includes(pages.ripostes) && <NavItem label="Riposte" {...navInfo('ripostes')} />}
          {authorizedPages.includes(pages.teams) && <NavItem label="&Eacute;quipes" {...navInfo('teams')} />}
          {authorizedPages.includes(pages.news) && <NavItem label="Actualités" {...navInfo('news')} />}
          {authorizedPages.includes(pages.phoning) && <NavItem label="Phoning" {...navInfo('phoning')} />}
        </div>
        <MentionsLegales />
      </div>
    </>
  )
}

export default Sidebar

Sidebar.propTypes = {
  toggleSidebar: PropTypes.bool.isRequired,
}
