import PropTypes from 'prop-types'
import paths from 'shared/paths'
import { featuresLabels } from 'shared/features'
import NavItem from 'ui/NavItem/NavItem'
import { useUserScope } from '../../redux/user/hooks'

export const NavMenu = ({ handleItemClick, group }) => {
  const [currentScope] = useUserScope()

  return (
    <div className="menu-list mt-6">
      <h5 className="menu-list__header">{group.label}</h5>
      <nav className="menu-list__links">
        {group.features.map(
          featureKey =>
            currentScope.hasFeature(featureKey) && (
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
