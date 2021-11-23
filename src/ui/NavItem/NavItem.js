import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { Icon as MUIIcon, Typography } from '@mui/material'
import { styled } from '@mui/system'

const UINavLink = styled(NavLink)`
  display: flex;
  margin-left: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(1.5, 2)};
  border-radius: 8px 0 0 8px;
  &:hover {
    color: ${({ theme }) => theme.palette.gray600};
    background: ${({ theme }) => theme.palette.gray100};
  }
  &.active {
    color: ${({ theme, color }) => theme.palette[color] || 'initial'};
    background: ${({ bgcolor }) => bgcolor || 'transparent'};
  }
`

const Icon = styled(MUIIcon)`
  font-size: 14px;
  padding-right: ${({ theme }) => theme.spacing(2)};
`

const UINavItem = ({ path, label, icon = null, color = null, bgcolor = null }) => (
  <UINavLink to={path} color={color} bgcolor={bgcolor}>
    <Icon component={icon} />
    <Typography variant="body2">{label}</Typography>
  </UINavLink>
)

UINavItem.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  color: PropTypes.string,
  bgcolor: PropTypes.string,
}

export default UINavItem
