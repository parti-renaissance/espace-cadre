import { Box, Grid, IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import PropTypes from 'prop-types'
import Button, { ActionButton } from '~/ui/Button/Button'
import Title from '~/ui/Title'
import Dialog from './Dialog'

const messages = {
  close: 'Fermer',
}

export const ModalForm = ({
  title,
  handleClose,
  createOrEdit,
  submitLabel,
  actions,
  isLoading,
  disabledButton = false,
  children,
}) => (
  <Dialog data-cy="modal-create-edit" handleClose={handleClose} open>
    <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Title title={title} />
      <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
        <CloseIcon />
      </IconButton>
    </Grid>
    <Box
      sx={{ mt: 4, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}
      role="presentation"
    >
      <Box sx={{ flex: '1 1 0%' }} className="space-y-4">
        {children}
      </Box>
      <Grid container sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {actions}
        <ActionButton
          type="submit"
          disabled={disabledButton}
          handleSubmit={createOrEdit}
          isLoading={isLoading}
          data-cy="modal-create-edit-submit"
        >
          {submitLabel}
        </ActionButton>
        <Button onClick={handleClose} aria-label="close" isMainButton data-cy="modal-create-edit-close">
          {messages.close}
        </Button>
      </Grid>
    </Box>
  </Dialog>
)

ModalForm.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func,
  createOrEdit: PropTypes.func,
  isLoading: PropTypes.bool,
  submitLabel: PropTypes.string,
  actions: PropTypes.node,
  disabledButton: PropTypes.bool,
  children: PropTypes.node,
}
