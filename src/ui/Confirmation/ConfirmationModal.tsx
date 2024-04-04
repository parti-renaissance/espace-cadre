import { forwardRef } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, SlideProps, Typography } from '@mui/material'
import Loader from '~/ui/Loader'
import { CssSpacing } from '~/theme/spacing'

interface ConfirmationModalProps {
  title: string
  description: string
  okButtonTitle?: string
  onConfirm?: () => void
  onCancel?: () => void
  isLoading?: boolean
}

const ConfirmationModal = ({
  title,
  description,
  onConfirm,
  onCancel,
  okButtonTitle,
  isLoading = true,
  ...props
}: ConfirmationModalProps) => (
  <Dialog open onClose={onCancel} TransitionComponent={Transition} {...props}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography>{description}</Typography>
    </DialogContent>
    <DialogActions>
      <Button variant="text" onClick={onCancel}>
        Annuler
      </Button>
      <Button variant="outlined" onClick={onConfirm} disabled={isLoading}>
        {isLoading && (
          <span style={{ marginRight: CssSpacing.smaller }}>
            <Loader color={'text.disabled'} size={10} />
          </span>
        )}{' '}
        {okButtonTitle ?? 'Confirmer'}
      </Button>
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
