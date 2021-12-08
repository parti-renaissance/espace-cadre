import React, { useState } from 'react'
import { IconButton as MuiIconButton, Menu, MenuItem as MuiMenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'

const Wrapper = styled('div')`
  display: flex;
`

const Button = styled(MuiIconButton)(
  ({ theme }) => `
  margin-top: ${theme.spacing(1.25)}
`
)

const MenuItem = styled(MuiMenuItem)`
  font-size: 13px;
  padding: ${({ theme }) => theme.spacing(0.5, 1)};
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.palette.gray100};
  border-radius: 8.35px;
  background-color: ${({ theme }) => theme.palette.whiteCorner};
  &:hover {
    background-color: ${({ theme }) => theme.palette.gray100};
  },
`

export const DotsMenuItem = ({ onClick, closeMenu, children }) => {
  const handleClick = () => {
    closeMenu()
    onClick()
  }
  return <MenuItem onClick={handleClick}>{children}</MenuItem>
}

DotsMenuItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  closeMenu: PropTypes.func,
  children: PropTypes.node.isRequired,
}

const DotsMenu = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleButtonClick = e => {
    setAnchorEl(e.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  return (
    <Wrapper>
      <Button size="small" onClick={handleButtonClick}>
        <MoreVertIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}
        sx={{
          fontSize: '13px',
          padding: 0,
          borderRadius: '8.35px',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {React.Children.map(children, c => React.cloneElement(c, { closeMenu }))}
      </Menu>
    </Wrapper>
  )
}

DotsMenu.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DotsMenu
