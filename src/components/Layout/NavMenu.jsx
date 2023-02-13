import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { getAuthorizedPages } from '../../redux/user/selectors'
import paths from 'shared/paths'
import { featuresLabels } from 'shared/features'
import NavItem from 'ui/NavItem/NavItem'

export const NavMenu = ({ handleItemClick, group }) => {
  const authorizedFeatures = useSelector(getAuthorizedPages)
  return (
    <div className="menu-list mt-6">
      <h5 className="menu-list__header">{group.label}</h5>
      <nav className="menu-list__links">
        {group.features.map(
          featureKey =>
            authorizedFeatures.includes(featureKey) && (
              <NavItem
                key={featureKey}
                path={paths[featureKey]}
                label={featuresLabels[featureKey]}
                handleClick={handleItemClick}
              />
            )
        )}
      </nav>
    </div>
  )
}

export default NavMenu

NavMenu.propTypes = {
  handleItemClick: PropTypes.func,
  group: PropTypes.object,
}
