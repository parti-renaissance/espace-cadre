import PropTypes from 'prop-types'
import { Dialog, Paper } from '@mui/material'
import { styled } from '@mui/system'

const StyledPaper = styled(Paper)(
  ({ theme }) => `
    padding: ${theme.spacing(4)};
    width: 664px;
    border-radius: 12px;
    `
)

const Modal = ({ open, handleClose, children }) => {
  return (
    <Dialog open={open} onClose={handleClose} PaperComponent={StyledPaper}>
      {children}
    </Dialog>
  )
}

export default Modal

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  children: PropTypes.node.isRequired,
}
