import { useState } from 'react'
import { IconButton, makeStyles, createStyles } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'
import Riposte from 'domain/riposte'

const useStyles = makeStyles(theme =>
  createStyles({
    iconButton: {
      marginTop: '10px',
    },
    root: {
      fontSize: '13px',
      padding: '4px 8px',
      border: `1px solid ${theme.palette.gray100}`,
      borderRadius: '8.35px',
      background: theme.palette.whiteCorner,
      '&:hover': {
        background: theme.palette.gray100,
      },
    },
  })
)

const RiposteEnableStatus = ({ riposte, toggleEnabled }) => {
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
        aria-label="more"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={event => {
          setAnchorEl(event.currentTarget)
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
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
            toggleEnabled(riposte.id)
          }}
          className={classes.root}
        >
          {riposte.enabled ? 'Désactiver' : 'Activer'}
        </MenuItem>
      </Menu>
    </div>
  )
}

export default RiposteEnableStatus

RiposteEnableStatus.propTypes = {
  riposte: Riposte.propTypes.isRequired,
  toggleEnabled: PropTypes.func.isRequired,
}
