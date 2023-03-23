import PropTypes from 'prop-types'
import { Box, IconButton, Typography } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import VerifiedIcon from '@mui/icons-material/Verified'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import Activist from 'domain/activist'
import { UIChip } from 'ui/Card'

const LineText = ({ label, value }) => (
  <Box py={1.5} className="space-y-1">
    <Typography component="dt" sx={{ color: 'colors.gray.500' }}>
      {label}
    </Typography>
    {typeof value === 'string' ? (
      <Typography component="dd" sx={{ color: 'colors.gray.900' }}>
        {value}
      </Typography>
    ) : (
      value
    )}
  </Box>
)

LineText.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}

const Subscription = ({ subscription }) => (
  <Box display="flex" alignItems="center" ml={1.5} color="colors.gray.500">
    (
    {subscription ? (
      <VerifiedIcon sx={{ color: 'green700', fontSize: '18px' }} />
    ) : (
      <RemoveCircleIcon sx={{ color: 'red600', fontSize: '18px' }} />
    )}
    <Typography component="span" sx={{ ml: 1, fontSize: '14px' }}>
      {subscription ? 'Abonné' : 'Désabonné'}
    </Typography>
    )
  </Box>
)

Subscription.propTypes = {
  subscription: PropTypes.bool.isRequired,
}

const Member = ({ member, handleClose, renaissanceMembership }) => {
  if (!member) return null

  return (
    <Box sx={{ width: '32rem', height: '100%' }} role="slide-over">
      <Box sx={{ overflowY: 'scroll', height: '100%', bgcolor: 'whiteCorner' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            color: 'colors.gray.400',
          }}
        >
          <Typography variant="h5" sx={{ color: 'colors.gray.800' }}>
            {member.firstname} {member.lastname}
          </Typography>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
        <div className="px-4">
          <LineText
            label="Adresse e-mail"
            value={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography component="span" sx={{ color: 'colors.gray.900' }}>
                  {member.raw.email}
                </Typography>
                <Subscription subscription={member.raw.email_subscription} />
              </Box>
            }
          />
          <LineText
            label="Téléphone"
            value={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography component="span" sx={{ color: 'colors.gray.900' }}>
                  {member.raw.phone_number}
                </Typography>
                <Subscription subscription={member.raw.sms_subscription} />
              </Box>
            }
          />
          <LineText label="Adresse complète" value={`${member.city} (${member.cityId})`} />
          <LineText
            label="Renaissance"
            value={
              <UIChip
                label={
                  typeof renaissanceMembership[member.raw.renaissance_membership] !== 'undefined'
                    ? renaissanceMembership[member.raw.renaissance_membership]
                    : 'N/A'
                }
                color={
                  typeof renaissanceMembership[member.raw.renaissance_membership] !== 'undefined'
                    ? 'colors.blue.500'
                    : 'colors.gray.800'
                }
                bgcolor={
                  typeof renaissanceMembership[member.raw.renaissance_membership] !== 'undefined'
                    ? 'colors.blue.50'
                    : 'colors.gray.100'
                }
                labelStyle={{ fontSize: '14px' }}
              />
            }
          />
          <LineText
            label="Intérêts"
            value={
              <Box display="flex" alignItems="center" className="space-x-2">
                {member.interests.length > 0 &&
                  member.interests.map((interest, index) => (
                    <UIChip
                      key={index}
                      label={interest}
                      color="colors.blue.500"
                      bgcolor="colors.blue.50"
                      labelStyle={{ fontSize: '14px' }}
                    />
                  ))}
                {member.interests.length === 0 && (
                  <Typography component="p" sx={{ color: 'colors.gray.900' }}>
                    Aucun
                  </Typography>
                )}
              </Box>
            }
          />
        </div>
      </Box>
    </Box>
  )
}

export default Member

Member.propTypes = {
  member: Activist.propTypes,
  handleClose: PropTypes.func.isRequired,
  renaissanceMembership: PropTypes.object.isRequired,
}
