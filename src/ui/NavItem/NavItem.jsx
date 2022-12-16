import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

const NavItem = ({ path, label, icon = null, handleClick = null }) => (
  <NavLink to={path} onClick={handleClick || (() => {})} className="nav-link">
    {label}
  </NavLink>
)

NavItem.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  handleClick: PropTypes.func,
}

export default NavItem
