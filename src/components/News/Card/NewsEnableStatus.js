import { useState } from 'react'
import { Button as MuiButton, Menu, MenuItem } from '@mui/material'
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

const Button = styled(MuiButton)(
  ({ theme }) => `
  margin-top: ${theme.spacing(1.25)}
`
)

const NewsEnableStatus = ({ id, status, toggleStatus }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        size="small"
        aria-label="more"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={event => {
          setAnchorEl(event.currentTarget)
        }}
      >
        <MoreVertIcon />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        classes={{ list: classes.list }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose()
            toggleStatus(id)
          }}
          style={{ fontSize: '13px' }}
        >
          {status ? 'Dépubliée' : 'Publiée'}
        </MenuItem>
      </Menu>
    </div>
  )
}

export default NewsEnableStatus

NewsEnableStatus.propTypes = {
  id: PropTypes.string.isRequired,
  status: PropTypes.bool.isRequired,
  toggleStatus: PropTypes.func.isRequired,
}
