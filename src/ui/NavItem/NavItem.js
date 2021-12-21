import PropTypes from 'prop-types'
import { NavLink as MUINavLink } from 'react-router-dom'
import { Icon as MUIIcon, Typography } from '@mui/material'
import { styled } from '@mui/system'

const NavLink = styled(MUINavLink)`
  color: ${({ theme }) => theme.palette.menu.color.main};
  display: flex;
  margin: ${({ theme }) => theme.spacing(1, 2)};
  padding: ${({ theme }) => theme.spacing(1.5, 2)};
  border-radius: 8px;
  &:hover {
    color: ${({ theme }) => theme.palette.menu.color.main};
    background: ${({ theme }) => theme.palette.menu.background.hover};
  }
  &.active {
    color: ${({ theme }) => theme.palette.menu.color.active};
    background: ${({ theme }) => theme.palette.menu.background.active};
  }
`

const Icon = styled(MUIIcon)`
  font-size: 14px;
  padding-right: ${({ theme }) => theme.spacing(2)};
`

const NavItem = ({ path, label, icon = null }) => (
  <NavLink to={path}>
    <Icon component={icon} />
    <Typography variant="body2">{label}</Typography>
  </NavLink>
)

NavItem.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
}

export default NavItem
