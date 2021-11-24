import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'

import { getAuthorizedPages } from '../../redux/user/selectors'
import Scopes from '../Scopes'
import { UINavItem } from 'ui'
import MentionsLegales from 'components/MentionsLegales/MentionsLegales'
import barChart from 'assets/bar-chart.svg'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import MapRoundedIcon from '@mui/icons-material/MapRounded'
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import RssFeedIcon from '@mui/icons-material/RssFeed'

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

const Sidebar = ({ toggleSidebar }) => {
  const authorizedPages = useSelector(getAuthorizedPages)
  const classes = useStyles()

  return (
    <>
      <div id="sidebar" className={`${classes.sidebar} ${toggleSidebar ? 'active' : ''}`}>
        <Link to="/" className={classes.brandLink}>
          <div className={classes.logoContainer}>
            <img src={barChart} alt="bar chart" className={classes.barChart} />
            <div className={classes.logoText}>{messages.title}</div>
            <span className={classes.beta}>BÊTA</span>
          </div>
        </Link>
        <Scopes />
        <div className={classes.navMenu}>
          <NavItem id="dashboard" url="/" label="Vue d’ensemble" display={authorizedPages.includes('dashboard')} />
          <NavItem id="adherents" url="/adherents" label="Adhérents" display={authorizedPages.includes('contacts')} />
          <NavItem
            id="messagerie"
            url="/messagerie"
            label="Messagerie"
            display={authorizedPages.includes('messages')}
          />
          <NavItem
            id="elections"
            url="/elections"
            label="&Eacute;lections"
            display={authorizedPages.includes('elections')}
          />
          <NavItem id="ripostes" url="/ripostes" label="Ripostes" display={authorizedPages.includes('ripostes')} />
          <NavItem id="teams" url="/equipes" label="&Eacute;quipes" display={authorizedPages.includes('team')} />
          <NavItem id="news" url="/actualites" label="Actualités" display={authorizedPages.includes('news')} />
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

const NavItem = ({ id, url, label, display }) =>
  display ? (
    <UINavItem path={url} label={label} icon={icons[id]} color={colors[id].color} bgcolor={colors[id].bgColor} />
  ) : null
NavItem.propTypes = {
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  display: PropTypes.bool.isRequired,
}

const icons = {
  dashboard: DashboardRoundedIcon,
  adherents: PeopleRoundedIcon,
  messagerie: EmailRoundedIcon,
  elections: MapRoundedIcon,
  ripostes: PostAddRoundedIcon,
  teams: StarRoundedIcon,
  news: RssFeedIcon,
}

const colors = {
  dashboard: { color: 'gray900', bgColor: '#F3F4F6' },
  adherents: { color: 'lightBlue600', bgColor: '#EBF6FB' },
  messagerie: { color: 'yellow400', bgColor: '#FFFAEE' },
  elections: { color: 'green600', bgColor: '#EBF7F3' },
  ripostes: { color: 'teal700', bgColor: '#ECF4F4' },
  teams: { color: 'cyan700', bgColor: '#EBF3F8' },
  news: { color: 'orange500', bgColor: '#FFF4ED' },
}
