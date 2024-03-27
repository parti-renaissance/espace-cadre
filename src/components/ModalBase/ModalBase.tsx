import { ModalProps } from '@mui/base'
import { Box } from '@mui/system'
import { Modal } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

interface ModalBaseProps extends Omit<ModalProps, 'open'> {
  pageOnMobile?: boolean
}

export default function ModalBase({ children, pageOnMobile = false, ...props }: ModalBaseProps) {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.only('xs'))

  return (
    <Modal open={true} data-testid="modal" {...props}>
      <Box sx={isXs && pageOnMobile ? xsStyle : style}>{children}</Box>
    </Modal>
  )
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  minWidth: 400,
  maxWidth: 1000,
  bgcolor: 'background.paper',
  p: 4,
  borderRadius: 2,
}

const xsStyle = {
  bgcolor: 'background.paper',
  height: '100vh',
  width: '100vw',
  p: 4,
}
