import PropTypes from 'prop-types'
import { NavLink as MUINavLink } from 'react-router-dom'
import { Box, Chip, Typography } from '@mui/material'
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

const NavItem = ({ path, label, handleClick = null, isNew = false }) => (
  <NavLink to={path} onClick={handleClick || (() => {})}>
    <Box display="flex" alignItems="center" gap={1}>
      <Typography variant="menu">{label}</Typography>
      {isNew && (
        <Chip
          label="Nouveau"
          size="small"
          sx={{
            fontSize: '10px',
            height: 16,
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 500,
          }}
        />
      )}
    </Box>
  </NavLink>
)

NavItem.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handleClick: PropTypes.func,
  isNew: PropTypes.bool,
}

export default NavItem
