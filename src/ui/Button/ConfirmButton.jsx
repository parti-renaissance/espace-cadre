import { IconButton } from '@mui/material'
import { useState } from 'react'
import PropTypes from 'prop-types'
import ConfirmationModal from 'ui/Confirmation/ConfrmationModal'

const ConfirmButton = ({ title, description, children, onClick }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton edge="start" color="inherit" onClick={() => setOpen(true)} aria-label="delete" sx={{ ml: 0.5 }}>
        {children}
      </IconButton>
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
}
