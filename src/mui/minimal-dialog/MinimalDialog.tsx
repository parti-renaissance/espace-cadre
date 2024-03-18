import { Dialog, DialogTitle } from '@mui/material'
import { DialogProps } from '@mui/material/Dialog/Dialog'
import { useTheme } from '@mui/material/styles'

interface MinimalDialogProps extends DialogProps {
  isEditing?: boolean
  title?: string
  editTitle?: string
}

export default function MinimalDialog({ isEditing = false, title, editTitle, children, ...rest }: MinimalDialogProps) {
  const theme = useTheme()

  return (
    <Dialog
      fullWidth
      maxWidth={'md'}
      transitionDuration={{
        // enter: theme.transitions.duration.shortest,
        exit: theme.transitions.duration.shortest - 80,
      }}
      {...rest}
    >
      <DialogTitle sx={{ minHeight: 76 }} data-testid={'dialog-title'}>
        {isEditing ? editTitle : title}
      </DialogTitle>

      {children}
    </Dialog>
  )
}
