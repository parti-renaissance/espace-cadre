import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { getAuthorizedPages } from '../../redux/user/selectors'
import paths from 'shared/paths'
import features, { featuresLabels } from 'shared/features'
import icons from 'components/Layout/shared/icons'
import colors from 'components/Layout/shared/colors'
import NavItem from 'ui/NavItem/NavItem'

export const NavMenu = ({ handleItemClick }) => {
  const authorizedFeatures = useSelector(getAuthorizedPages)
  return (
    <div>
      {Object.keys(features).map(
        featureKey =>
          authorizedFeatures.includes(featureKey) && (
            <NavItem
              key={featureKey}
              path={paths[featureKey]}
              icon={icons[featureKey]}
              color={colors[featureKey].color}
              bgcolor={colors[featureKey].bgColor}
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
}
