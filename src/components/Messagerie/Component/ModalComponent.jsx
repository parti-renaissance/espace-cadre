import { Dialog, Paper, Grid, Button, Typography } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import pluralize from '~/components/shared/pluralize/pluralize'

const StyledPaper = styled(Paper)`
  background: ${({ theme }) => theme.palette.whiteCorner};
  border-radius: 12px;
  padding: 32px;
`

const Title = styled(Typography)`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.gray700};
  margin-bottom: 10px;
`

const Confirmation = styled(Typography)(
  ({ theme }) => `
  font-size: 14px;
  color: ${theme.palette.gray700};
  font-weight: 400;
  margin: ${theme.spacing(0, 0, 4)}
`
)

const Cancel = styled(Button)(
  ({ theme }) => `
  color: ${theme.palette.main};
  background: ${theme.palette.whiteCorner};
  border: 1px solid ${theme.palette.main};
  border-radius: 8px;
  padding: ${theme.spacing(1, 2)};
  margin-right: ${theme.spacing(2)};
  &:hover {
    background: ${theme.palette.gray100};
  }
`
)

const Send = styled(Button)(
  ({ theme }) => `
  color: ${theme.palette.whiteCorner};
  background: ${theme.palette.main};
  border-radius: 8px;
  padding: ${theme.spacing(1, 2)};
  &:hover {
    background: ${theme.palette.main}
  }
`
)

const messages = {
  title: 'Confirmation',
  confirmation: 'Êtes-vous sûr de vouloir envoyer le message à ',
  contact: 'contact',
  questionMark: '?',
  cancel: 'Annuler',
  send: 'Envoyer',
}

const ModalComponent = ({ open, handleClose, handleSendEmail, recipientCount }) => (
  <Dialog open={open} onClose={handleClose} PaperComponent={StyledPaper} data-cy="send-mail-modal-confirmation">
    <Title>{messages.title}</Title>
    <Confirmation>
      {messages.confirmation}
      {recipientCount} {pluralize(recipientCount, messages.contact)} {messages.questionMark}
    </Confirmation>
    <Grid container sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Cancel variant="contained" onClick={handleClose}>
        {messages.cancel}
      </Cancel>
      <Send
        variant="contained"
        onClick={() => {
          handleSendEmail()
          handleClose()
        }}
        data-cy="confirm-send-mail"
      >
        {messages.send}
      </Send>
    </Grid>
  </Dialog>
)

export default ModalComponent

ModalComponent.defaultProps = {
  recipientCount: 0,
}

ModalComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSendEmail: PropTypes.func.isRequired,
  recipientCount: PropTypes.number,
}
