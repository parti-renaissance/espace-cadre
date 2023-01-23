import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { getAuthorizedPages } from '../../redux/user/selectors'
import paths from 'shared/paths'
import { featuresLabels } from 'shared/features'
import NavItem from 'ui/NavItem/NavItem'

export const NavMenu = ({ handleItemClick, features }) => {
  const authorizedFeatures = useSelector(getAuthorizedPages)
  return (
    <div>
      {Object.keys(features).map(
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
    </div>
  )
}

export default NavMenu

NavMenu.propTypes = {
  handleItemClick: PropTypes.func,
  features: PropTypes.object,
}
