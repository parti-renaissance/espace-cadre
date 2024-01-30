import { Dialog as MuiDialog, Paper as MuiPaper } from '@mui/material'
import { styled } from '@mui/system'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import PropTypes from 'prop-types'

const Paper = styled(MuiPaper)`
  width: 664px;
  border-radius: 12px;
`

const Dialog = ({ children, handleClose, open, ...props }) => {
  const { isMobile } = useCurrentDeviceType()

  return (
    <MuiDialog
      open={open}
      scroll={isMobile ? 'paper' : 'body'}
      fullScreen={isMobile}
      onClose={() => handleClose()}
      PaperComponent={Paper}
      PaperProps={{ sx: { p: isMobile ? 2 : 4 } }}
      sx={{ my: isMobile ? null : 4 }}
      {...props}
    >
      {children}
    </MuiDialog>
  )
}

Dialog.propTypes = {
  children: PropTypes.node.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  props: PropTypes.object,
}

export default Dialog
