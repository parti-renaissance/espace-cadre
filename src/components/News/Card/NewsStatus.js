import { useState } from 'react'
import { IconButton as MuiIconButton, Menu, MenuItem as MuiMenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'

const useStyles = makeStyles(() => ({
  list: {
    fontSize: '13px',
    padding: 0,
    borderRadius: '8.35px',
  },
}))

const Button = styled(MuiIconButton)(
  ({ theme }) => `
  margin-top: ${theme.spacing(1.25)}
`
)

const MenuItem = styled(MuiMenuItem)(`
  font-size: 13px;
`)

const messages = {
  published: 'Publier',
  unPublished: 'Dépublier',
}

const NewsStatus = ({ id, status, toggleStatus }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleButtonClick = e => {
    setAnchorEl(e.currentTarget)
  }

  const handleMenuItemClick = () => {
    setAnchorEl(null)
    toggleStatus(id)
  }

  return (
    <div>
      <Button size="small" onClick={handleButtonClick}>
        <MoreVertIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}
        classes={{ list: classes.list }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={handleMenuItemClick}>{status ? messages.unPublished : messages.published}</MenuItem>
      </Menu>
    </div>
  )
}

export default NewsStatus

NewsStatus.propTypes = {
  id: PropTypes.string.isRequired,
  status: PropTypes.bool.isRequired,
  toggleStatus: PropTypes.func.isRequired,
}
