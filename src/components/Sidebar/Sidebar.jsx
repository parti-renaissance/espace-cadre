import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core'

import { getAuthorizedPages } from '../../redux/user/selectors'
import Scopes from '../Scopes'
import { MENU } from '../../Routes'
import PATHS from '../../paths'
import { UINavItem, Icons, Colors } from 'ui'
import MentionsLegales from 'components/MentionsLegales/MentionsLegales'
import barChart from 'assets/bar-chart.svg'

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
    [theme.breakpoints.down('md')]: {
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
    marginRight: '2px',
  },
  logoText: {
    color: theme.palette.blackCorner,
    fontSize: '20px',
    fontWeight: '600',
  },
  beta: {
    color: theme.palette.blackCorner,
    textTransform: 'uppercase',
    fontSize: '8px',
    height: '12px',
    fontWeight: '500',
    backgroundColor: theme.palette.blueBubble,
    marginLeft: theme.spacing(0.25),
    padding: theme.spacing(0.25, 0.5),
    borderRadius: '4px',
  },
  navMenu: {
    marginTop: theme.spacing(7),
  },
}))

const Sidebar = () => {
  const authorizedPage = useSelector(getAuthorizedPages)
  const filteredMenu = MENU.filter(item => authorizedPage && authorizedPage.includes(item.id))
  const classes = useStyles()

  useEffect(() => {
    $('#toggleButton').on('click', () => {
      $('#sidebar, #pageContent').toggleClass('active')
    })
  }, [])

  return (
    <>
      <div id="sidebar" className={classes.sidebar}>
        <Link to={PATHS.DASHBOARD.route} className={classes.brandLink}>
          <div className={classes.logoContainer}>
            <img src={barChart} alt="bar chart" className={classes.barChart} />
            <div className={classes.logoText}>DataCorner</div>
            <span className={classes.beta}>beta</span>
          </div>
        </Link>
        <Scopes />
        <div className={classes.navMenu}>
          {filteredMenu.map(item => (
            <UINavItem
              key={item.id}
              path={item.url}
              label={item.label}
              icon={Icons[item.id]}
              color={Colors[item.id].color}
              bgColor={Colors[item.id].bgColor}
            />
          ))}
        </div>
        <MentionsLegales />
      </div>
    </>
  )
}

export default Sidebar
