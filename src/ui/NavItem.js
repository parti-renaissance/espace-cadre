import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { Icon, Typography } from '@mui/material'

import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    marginLeft: theme.spacing(4),
    padding: theme.spacing(1.5, 2),
    borderRadius: '8px 0 0 8px',
    color: theme.palette.gray600,
    '&:hover': {
      color: theme.palette.gray600,
      background: theme.palette.gray100,
    },
  },
  active: {
    color: ({ color }) => `${theme.palette[color] || 'initial'}`,
    background: ({ bgColor }) => bgColor || 'transparent',
    '&:hover': {
      color: ({ color }) => `${theme.palette[color] || 'initial'}`,
      background: ({ bgColor }) => bgColor || 'transparent',
    },
  },
  icon: {
    fontSize: '14px',
    paddingRight: theme.spacing(2),
  },
}))

const UINavItem = ({ path, label, icon = null, color = null, bgColor = null }) => {
  const classes = useStyles({ color, bgColor })

  return (
    <NavLink className={({ isActive }) => [].concat(classes.root, isActive ? classes.active : '').join(' ')} to={path}>
      <Icon component={icon} className={classes.icon} />
      <Typography variant="body2">{label}</Typography>
    </NavLink>
  )
}

UINavItem.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  color: PropTypes.string,
  bgColor: PropTypes.string,
}

export default UINavItem
