import React, { useState } from 'react'
import { IconButton, Menu, MenuItem as MuiMenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import Loader from 'ui/Loader'

const Wrapper = styled('div')`
  display: flex;
`

const MenuItem = styled(MuiMenuItem)`
  font-size: 13px;
  padding: ${({ theme }) => theme.spacing(0.5, 1)};
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.palette.gray100};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.palette.whiteCorner};
  &:hover {
    background-color: ${({ theme }) => theme.palette.gray100};
  },
`

export const DotsMenuItem = ({ onClick, closeMenu, loader = false, children }) => {
  const handleClick = async () => {
    await onClick()
    closeMenu()
  }
  return (
    <MenuItem onClick={handleClick}>
      {loader && <Loader size={12} />}
      {children}
    </MenuItem>
  )
}

DotsMenuItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  closeMenu: PropTypes.func,
  loader: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

const DotsMenu = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClick = e => {
    setAnchorEl(e.currentTarget)
  }

  return (
    <Wrapper>
      <IconButton size="small" onClick={handleClick} sx={{ p: 0 }}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        transitionDuration={0}
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}
        sx={{
          fontSize: '13px',
          padding: 0,
          borderRadius: '8px',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {React.Children.map(children, c => c && React.cloneElement(c, { closeMenu: handleClose }))}
      </Menu>
    </Wrapper>
  )
}

DotsMenu.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DotsMenu
