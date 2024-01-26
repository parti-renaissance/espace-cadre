import { Box, Grid, IconButton, Typography } from '@mui/material'
import { mandates } from 'shared/constants'
import { Mandate as MandateObject } from 'domain/mandate'
import ConfirmButton from 'ui/Button/ConfirmButton'
import DeleteIcon from '@mui/icons-material/Delete'
import PropTypes from 'prop-types'
import EditIcon from 'ui/icons/EditIcon'
import { formatDate } from 'shared/helpers'

const Mandate = ({ mandate, removeAction, editAction }) => (
  <Box sx={{ mt: 2 }}>
    <Grid container>
      <Grid item xs={10}>
        <Typography component="p" sx={{ color: 'colors.gray.700', fontSize: '13px' }}>
          {mandates[mandate.mandateType]}
        </Typography>
        <Typography component="p" sx={{ color: 'colors.gray.500', fontSize: '12px', my: 1 }}>
          {mandate.delegation}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', ml: 2 }}>
          <IconButton onClick={() => editAction(mandate)}>
            <EditIcon sx={{ color: 'colors.gray.500', fontSize: '20px' }} />
          </IconButton>
          <ConfirmButton
            title={'Suppression du mandat'}
            description={'Êtes-vous sûr de vouloir supprimer ce mandat ?'}
            onClick={() => removeAction(mandate.uuid)}
          >
            <DeleteIcon sx={{ color: 'form.error.color', fontSize: '20px' }} />
          </ConfirmButton>
        </Box>
      </Grid>
      <Grid item xs={12}>
        {mandate.zone && (
          <Typography
            component={'p'}
            sx={{ color: 'colors.gray.500', fontSize: '13px', mb: 0.5 }}
          >{`${mandate.zone.name} (${mandate.zone.code})`}</Typography>
        )}
        <Typography component={'p'} sx={{ color: 'colors.gray.500', fontSize: '13px', mb: 0.5 }}>
          {mandate.finishAt
            ? `du ${formatDate(mandate.beginAt, 'dd/MM/yyyy')} au ${formatDate(mandate.finishAt, 'dd/MM/yyyy')}`
            : `depuis le ${formatDate(mandate.beginAt, 'dd/MM/yyyy')}`}
        </Typography>
      </Grid>
    </Grid>
  </Box>
)

export default Mandate

Mandate.propTypes = {
  mandate: MandateObject.propTypes.isRequired,
  removeAction: PropTypes.func.isRequired,
  editAction: PropTypes.func.isRequired,
}
