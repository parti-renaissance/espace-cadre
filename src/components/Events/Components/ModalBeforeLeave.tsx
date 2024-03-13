import { Dialog, DialogContent, DialogActions, Typography, DialogTitle, Button } from '@mui/material'
import { Blocker } from 'react-router-dom'

interface ModalBeforeLeaveProps {
  open: boolean
  onClose: () => void
  blocker: Blocker
}

export default function ModalBeforeLeave({ open, onClose, blocker }: ModalBeforeLeaveProps) {
  const dontSave = () => {
    onClose()
    if (blocker.proceed) {
      blocker.proceed()
    }
  }
  return (
    <Dialog open={open} onClose={onClose} data-cy="send-mail-modal-confirmation">
      <DialogTitle>Vous avez des modifications en cours</DialogTitle>
      <DialogContent>
        <Typography>{"Souhaitez-vous continuer ou quittez l'éditeur sans enregistrer vos modifications ?"}</Typography>.
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={dontSave}>
          Quitter sans enregistrer
        </Button>
        <Button variant="text" onClick={onClose}>
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  )
}
