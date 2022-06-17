import PropTypes from 'prop-types'
import { NavLink as MUINavLink } from 'react-router-dom'
import { Icon as MUIIcon, Typography } from '@mui/material'
import { styled } from '@mui/system'

const NavLink = styled(MUINavLink)(
  ({ theme }) => `
  color: ${theme.palette.menu.color.main};
  display: flex;
  margin: ${theme.spacing(1, 2)};
  padding: ${theme.spacing(1.5, 2)};
  border-radius: 8px;
  &:hover {
    color: ${theme.palette.menu.color.main};
    background: ${theme.palette.menu.background.hover};
  }
  &.active {
    color: ${theme.palette.menu.color.active};
    background: ${theme.palette.menu.background.active};
  }
`
)

const Icon = styled(MUIIcon)`
  font-size: 14px;
  padding-right: ${({ theme }) => theme.spacing(2)};
`

const NavItem = ({ path, label, icon = null, handleClick = null }) => (
  <NavLink to={path} onClick={handleClick || (() => {})}>
    <Icon component={icon} />
    <Typography variant="body2">{label}</Typography>
  </NavLink>
)

NavItem.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  handleClick: PropTypes.func,
}

export default NavItem
