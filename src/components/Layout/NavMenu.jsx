import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import paths from '~/shared/paths'
import { featuresLabels } from '~/shared/features'
import NavItem from '~/ui/NavItem/NavItem'
import { useUserScope } from '~/redux/user/hooks'

export const NavMenu = ({ handleItemClick, group }) => {
  const [currentScope] = useUserScope()
  const [show, setShow] = useState(true)

  const onClick = useCallback(() => {
    setShow(v => !v)
  }, [])

  return (
    <div className="menu-list mt-6">
      <button className="menu-list-header" onClick={onClick} type="button">
        <h5 className="menu-list-header__title">{group.label}</h5>
        <span>{show ? <RemoveIcon sx={{ fontSize: '18px' }} /> : <AddIcon sx={{ fontSize: '18px' }} />}</span>
      </button>
      {show && (
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
      )}
    </div>
  )
}

export default NavMenu

NavMenu.propTypes = {
  handleItemClick: PropTypes.func,
  group: PropTypes.object,
}
