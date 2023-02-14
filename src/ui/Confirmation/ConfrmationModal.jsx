import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material'
import Button from 'ui/Button'
import { DangerButton } from 'ui/Button/Button'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const ConfirmationModal = ({ title, description, onConfirm, onCancel, ...props }) => (
  <Dialog open onClose={onCancel} TransitionComponent={Transition} {...props}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-slide-description">{description}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <DangerButton onClick={onConfirm}>Confirmer</DangerButton>
      <Button onClick={onCancel} isMainButton>
        Annuler
      </Button>
    </DialogActions>
  </Dialog>
)

export default ConfirmationModal

ConfirmationModal.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
}
