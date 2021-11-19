import { useState } from 'react'
import { IconButton } from '@mui/material'
import { makeStyles } from '@mui/styles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  iconButton: {
    marginTop: theme.spacing(1.25),
  },
  root: {
    fontSize: '13px',
    padding: theme.spacing(0.5, 1),
    border: `1px solid ${theme.palette.gray100}`,
    borderRadius: '8.35px',
    background: theme.palette.whiteCorner,
    '&:hover': {
      background: theme.palette.gray100,
    },
  },
}))

const TeamRename = ({ handleEditTeam }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton
        size="small"
        className={classes.iconButton}
        onClick={event => {
          setAnchorEl(event.currentTarget)
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose()
            handleEditTeam()
          }}
          className={classes.root}
        >
          Modifier
        </MenuItem>
      </Menu>
    </div>
  )
}

export default TeamRename

TeamRename.propTypes = {
  handleEditTeam: PropTypes.func.isRequired,
}
