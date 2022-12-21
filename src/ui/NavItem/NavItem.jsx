import PropTypes from 'prop-types'
import { NavLink as MUINavLink } from 'react-router-dom'
import { Icon as MUIIcon, Typography } from '@mui/material'
import { styled } from '@mui/system'

const NavLink = styled(MUINavLink)(
  ({ theme }) => `
  color: ${theme.palette.colors.gray['500']};
  display: flex;
  padding: 6px 8px;
  border-radius: 6px;
  margin-top: 6px;
  background-color: transparent;
  &:hover {
    color: ${theme.palette.colors.gray['900']};
    background-color: ${theme.palette.colors.gray['50']};
  }
  &.active {
    color: ${theme.palette.colors.blue['500']};
    background-color: ${theme.palette.colors.blue['50']};
  }
`
)

const NavItem = ({ path, label, icon = null, handleClick = null }) => (
  <NavLink to={path} onClick={handleClick || (() => {})}>
    <Typography variant="menu">{label}</Typography>
  </NavLink>
)

NavItem.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  handleClick: PropTypes.func,
}

export default NavItem
