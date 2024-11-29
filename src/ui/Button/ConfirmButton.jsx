import { Button, IconButton } from '@mui/material'
import { useState } from 'react'
import PropTypes from 'prop-types'
import ConfirmationModal from '~/ui/Confirmation/ConfirmationModal'
import { DangerButton } from './Button'

const ConfirmButton = ({
  title,
  description,
  children,
  onClick,
  variant = 'outlined',
  color = 'inherit',
  size = 'normal',
  disabled = false,
  isDangerButton = false,
  okButtonTitle = null,
  isIcon = false,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {isDangerButton ? (
        <DangerButton
          disabled={disabled}
          onClick={() => setOpen(true)}
          rootProps={{ sx: { fontSize: '12px', px: 1.5, py: 0, gap: 1 } }}
        >
          {children}
        </DangerButton>
      ) : isIcon ? (
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
      ) : (
        <Button
          disabled={disabled}
          variant={variant}
          size={size}
          color={color}
          onClick={() => setOpen(true)}
          aria-label="delete"
          sx={{ ml: 0.5 }}
        >
          {children}
        </Button>
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
          okButtonTitle={okButtonTitle}
        />
      )}
    </>
  )
}

export default ConfirmButton

ConfirmButton.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  isDangerButton: PropTypes.bool,
  disabled: PropTypes.bool,
  okButtonTitle: PropTypes.string,
  variant: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  isIcon: PropTypes.bool,
}
