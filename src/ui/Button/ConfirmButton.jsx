import { IconButton } from '@mui/material'
import { useState } from 'react'
import PropTypes from 'prop-types'
import ConfirmationModal from '~/ui/Confirmation/ConfirmationModal'
import { DangerButton } from './Button'

const ConfirmButton = ({ title, description, children, onClick, disabled = false, isDangerButton = false }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {isDangerButton ? (
        <DangerButton
          disabled={disabled}
          onClick={() => setOpen(true)}
          rootProps={{ sx: { fontSize: '12px', px: 1, py: 0 } }}
        >
          {children}
        </DangerButton>
      ) : (
        <IconButton
          disabled={disabled}
          edge="start"
          color="inherit"
          onClick={() => setOpen(true)}
          aria-label="delete"
          sx={{ ml: 0.5 }}
        >
          {children}
        </IconButton>
      )}
      {open && (
        <ConfirmationModal
          onCancel={() => setOpen(false)}
          onConfirm={() => {
            onClick()
            setOpen(false)
          }}
          title={title}
          description={description}
        />
      )}
    </>
  )
}

export default ConfirmButton

ConfirmButton.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  isDangerButton: PropTypes.bool,
  disabled: PropTypes.bool,
}
