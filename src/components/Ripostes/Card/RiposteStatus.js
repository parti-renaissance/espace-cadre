import { useState } from 'react'
import { styled } from '@mui/system'
import { makeStyles } from '@mui/styles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import { MenuItem as MuiMenuItem, IconButton as MuiIconButton } from '@mui/material'
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

const MenuItem = styled(MuiMenuItem)(
  () => `
  font-size: 13px;
`
)

const messages = {
  activate: 'Activer',
  deactivate: 'Désactiver',
}

const RiposteStatus = ({ id, status, toggleStatus }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        size="small"
        onClick={event => {
          setAnchorEl(event.currentTarget)
        }}
      >
        <MoreVertIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        classes={{ list: classes.list }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose()
            toggleStatus(id)
          }}
        >
          {status ? messages.deactivate : messages.activate}
        </MenuItem>
      </Menu>
    </div>
  )
}

export default RiposteStatus

RiposteStatus.propTypes = {
  id: PropTypes.string.isRequired,
  status: PropTypes.bool.isRequired,
  toggleStatus: PropTypes.func.isRequired,
}
