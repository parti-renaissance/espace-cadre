import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { getAuthorizedPages } from '../../redux/user/selectors'
import paths from 'shared/paths'
import features, { featuresLabels } from 'shared/features'
import icons from 'components/Layout/shared/icons'
import NavItem from 'ui/NavItem/NavItem'

export const NavMenu = ({ handleItemClick }) => {
  const authorizedFeatures = useSelector(getAuthorizedPages)
  return (
    <div className="flex-1 px-4 py-5 overflow-y-auto">
      <div>
        <h5 className="px-2 text-sm leading-5 text-slate-400">Navigation</h5>
        <nav className="mt-5 space-y-1 navigation">
          {Object.keys(features).map(
            featureKey =>
              authorizedFeatures.includes(featureKey) && (
                <NavItem
                  key={featureKey}
                  path={paths[featureKey]}
                  icon={icons[featureKey]}
                  label={featuresLabels[featureKey]}
                  handleClick={handleItemClick}
                />
              )
          )}
        </nav>
      </div>
    </div>
  )
}

export default NavMenu

NavMenu.propTypes = {
  handleItemClick: PropTypes.func,
}
