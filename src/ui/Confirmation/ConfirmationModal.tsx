import { forwardRef } from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, SlideProps } from '@mui/material'
import Button from '~/ui/Button'
import { DangerButton } from '~/ui/Button/Button'

interface ConfirmationModalProps {
  title: string
  description: string
  okButtonTitle?: string
  onConfirm?: () => void
  onCancel?: () => void
}

const ConfirmationModal = ({
  title,
  description,
  onConfirm,
  onCancel,
  okButtonTitle,
  ...props
}: ConfirmationModalProps) => (
  <Dialog open onClose={onCancel} TransitionComponent={Transition} {...props}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-slide-description">{description}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} isMainButton>
        Annuler
      </Button>
      <DangerButton onClick={onConfirm}>{okButtonTitle ?? 'Confirmer'}</DangerButton>
    </DialogActions>
  </Dialog>
)

const Transition = forwardRef(function Transition({ children, ...props }: SlideProps, ref) {
  return (
    <Slide direction="up" ref={ref} {...props}>
      {children}
    </Slide>
  )
})

export default ConfirmationModal
