import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PropTypes from 'prop-types'

const AddButton = ({ handleAction, message, parentStyles }) => {
  return (
    <Button
      onClick={handleAction}
      sx={{
        color: parentStyles.color,
        background: parentStyles.background,
        padding: (0.75, 1),
        borderRadius: '8.35px',
      }}
    >
      <AddIcon sx={{ mr: 1 }} />
      {message}
    </Button>
  )
}

export default AddButton

AddButton.protTypes = {
  handleAction: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  parentStyles: PropTypes.object.isRequired,
}
