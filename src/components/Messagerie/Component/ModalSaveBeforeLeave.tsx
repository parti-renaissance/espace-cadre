import { Dialog, DialogContent, DialogActions, Typography, DialogTitle, Button } from '@mui/material'
import { Blocker } from 'react-router-dom'

interface ModalComponentProps {
  open: boolean
  onClose: () => void
  onSave: () => Promise<void>
  blocker: Blocker
}

export default function ModalComponent({ open, onClose, onSave, blocker }: ModalComponentProps) {
  const handleSave = () =>
    onSave().then(() => {
      onClose()
      if (blocker.proceed) {
        blocker.proceed()
      }
    })

  const dontSave = () => {
    onClose()
    if (blocker.proceed) {
      blocker.proceed()
    }
  }
  return (
    <Dialog open={open} onClose={onClose} data-cy="send-mail-modal-confirmation">
      <DialogTitle>Enregistrer le brouillon</DialogTitle>
      <DialogContent>
        <Typography>Souhaitez-vous enregistrer vos modifications avant de quitter l’éditeur de mail ?</Typography>.
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSave}>
          Enregister
        </Button>
        <Button variant="outlined" onClick={dontSave}>
          Ne pas enregistrer
        </Button>
        <Button variant="text" onClick={onClose}>
          Anuler
        </Button>
      </DialogActions>
    </Dialog>
  )
}
