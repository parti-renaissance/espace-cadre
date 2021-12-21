import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PropTypes from 'prop-types'

const AddButton = ({ handleAction, message, sx: parentStyles }) => (
  <Button
    onClick={handleAction}
    sx={{
      px: 1,
      py: 0.75,
      borderRadius: '8px',
      ...parentStyles,
    }}
  >
    <AddIcon sx={{ mr: 1 }} />
    {message}
  </Button>
)

export default AddButton

AddButton.propTypes = {
  handleAction: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  sx: PropTypes.object.isRequired,
}
