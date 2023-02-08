import { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, IconButton as MuiButton, Icon } from '@mui/material'
import { styled } from '@mui/system'
import { useSelector } from 'react-redux'

import Logo from 'ui/Logo/Logo'
import icons from 'components/Layout/shared/icons'
import { featuresGroup, featuresLabels } from 'shared/features'
import Scopes from '../Scopes'
import NavMenu from './NavMenu'
import Footer from './Footer'
import NavItem from 'ui/NavItem/NavItem'
import paths from 'shared/paths'
import { getAuthorizedPages } from '../../redux/user/selectors'

const IconButton = styled(MuiButton)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  justify: center;
  width: 40px;
  height: 40px;
  margin: 0 auto;
  border-radius: 6px;
  color: ${theme.palette.colors.white};
  &:hover {
    color: ${theme.palette.colors.white};
    background-color: ${theme.palette.colors.blue['700']};
  }
  &.active {
    color: ${theme.palette.colors.white};
    background-color: ${theme.palette.colors.blue['800']};
  }
`
)

const Navigation = ({ asideWidth, drawerWidth }) => {
  const authorizedFeatures = useSelector(getAuthorizedPages)
  const [group, setGroup] = useState()
  const [currentGroup, setCurrentGroup] = useState()
  const authorizedFeaturesGroup = useCallback(
    () =>
      featuresGroup.map(group => {
        let arrayFeatures = []
        group.features.map(featureKey => {
          if (authorizedFeatures.includes(featureKey)) {
            arrayFeatures.push(featureKey)
          }
        })
        return { ...group, features: arrayFeatures }
      }),
    [authorizedFeatures]
  )

  useEffect(() => {
    const groups = authorizedFeaturesGroup().filter(group => group.features.length > 0)
    setGroup(groups[0])
    setCurrentGroup(groups[0].slug ?? null)
  }, [authorizedFeaturesGroup])

  const activateFeatures = group => {
    setGroup(group)
    setCurrentGroup(group.slug)
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box
        sx={{ width: asideWidth, backgroundColor: theme => theme.palette.colors.blue['600'] }}
        className="aside-navigation"
      >
        <Logo classes="h-4 w-auto" fillColor="#fff" strokeColor="#fff" />
        <Scopes />
        <div className="menu-group">
          {authorizedFeaturesGroup().map((group, key) => {
            if (group.features.length > 0) {
              return (
                <IconButton
                  disableRipple={true}
                  onClick={() => activateFeatures(group)}
                  key={key}
                  className={currentGroup && currentGroup === group.slug ? 'active' : ''}
                >
                  <Icon component={icons[group.slug]} />
                  <span className="sr-only">{group.label}</span>
                </IconButton>
              )
            }
          })}
        </div>
      </Box>
      <Box
        sx={{
          flex: '1 1 0%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: drawerWidth - asideWidth,
          padding: '20px 16px',
        }}
      >
        <NavItem path={paths.dashboard} label={featuresLabels.dashboard} />
        <NavMenu group={group} />
        <Footer />
      </Box>
    </Box>
  )
}

export default Navigation

Navigation.propTypes = {
  drawerWidth: PropTypes.number,
  asideWidth: PropTypes.number,
}
