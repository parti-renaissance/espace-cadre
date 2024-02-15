import { Dialog, DialogTitle, Button, Typography, DialogContent, DialogActions } from '@mui/material'
import pluralize from '~/components/shared/pluralize/pluralize'

const messages = {
  title: 'Veuillez confirmer votre envoi.',
  confirmation: 'Vous êtes sur le point d’envoyer un email à ',
  contact: 'contact',
  cancel: 'Annuler',
  send: 'Envoyer',
}

interface ModalComponentProps {
  open: boolean
  handleClose: () => void
  handleSendEmail: () => void
  recipientCount: number
}

const ModalComponent = ({ open, handleClose, handleSendEmail, recipientCount = 0 }: ModalComponentProps) => (
  <Dialog open={open} onClose={handleClose} data-cy="send-mail-modal-confirmation">
    <DialogTitle>{messages.title}</DialogTitle>
    <DialogContent>
      <Typography>
        {messages.confirmation}
        <Typography fontWeight="medium">
          {recipientCount} {pluralize(recipientCount, messages.contact)}
        </Typography>
      </Typography>
      .
    </DialogContent>
    <DialogActions>
      <Button variant="text" onClick={handleClose}>
        {messages.cancel}
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          handleSendEmail()
          handleClose()
        }}
        data-cy="confirm-send-mail"
      >
        {messages.send}
      </Button>
    </DialogActions>
  </Dialog>
)

export default ModalComponent
