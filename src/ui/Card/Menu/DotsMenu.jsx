import React, { useState } from 'react'
import { IconButton, Menu, MenuItem as MuiMenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import Loader from '~/ui/Loader'

const Wrapper = styled('div')`
  display: flex;
`

const MenuItem = styled(MuiMenuItem)(
  ({ theme }) => `
    font-size: 13px;
    padding: ${theme.spacing(0.5, 1)};
    background-color: ${theme.palette.whiteCorner};
    &:hover {
      background-color: ${theme.palette.gray100};
    },
  `
)

export const DotsMenuItem = ({ onClick, closeMenu, children, cancelLoader = false, deleteLoader = false }) => {
  const handleClick = async () => {
    await onClick()
    closeMenu()
  }

  return (
    <MenuItem onClick={handleClick}>
      {cancelLoader && (
        <>
          <Loader size={12} />
          &nbsp;
        </>
      )}
      {deleteLoader && (
        <>
          <Loader size={12} />
          &nbsp;
        </>
      )}
      {children}
    </MenuItem>
  )
}

DotsMenuItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  closeMenu: PropTypes.func,
  children: PropTypes.node.isRequired,
  cancelLoader: PropTypes.bool,
  deleteLoader: PropTypes.bool,
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
    <Wrapper data-cy="dot-action-menu">
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
