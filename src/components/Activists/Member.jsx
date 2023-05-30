import PropTypes from 'prop-types'
import { Avatar, Box, Grid, IconButton, Typography } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined'
import VerifiedIcon from '@mui/icons-material/Verified'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { differenceInDays, format } from 'date-fns'
import Activist from 'domain/activist'
import { UIChip } from 'ui/Card'
import BadgeNew, { MemberBadge } from './BadgeNew'

const LineText = ({ label, value }) => (
  <Box py={1.5} className="space-y-1">
    <Typography component="dt" sx={{ color: 'colors.gray.500', fontSize: '14px' }}>
      {label}
    </Typography>
    {typeof value === 'string' ? (
      <Typography component="dd" sx={{ color: 'colors.gray.900', fontSize: '16px' }}>
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
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      bgcolor: subscription ? 'activeLabel' : 'inactiveLabel',
      color: subscription ? 'green600' : 'red600',
      px: 1,
      py: 0.5,
      borderRadius: '10px',
    }}
  >
    {subscription ? (
      <VerifiedIcon sx={{ color: 'green700', fontSize: '16px' }} />
    ) : (
      <RemoveCircleIcon sx={{ color: 'red600', fontSize: '16px' }} />
    )}
    <Typography component="span" sx={{ ml: 0.5, fontSize: '12px' }}>
      {subscription ? 'Abonné' : 'Désabonné'}
    </Typography>
  </Box>
)

Subscription.propTypes = {
  subscription: PropTypes.bool.isRequired,
}

const Member = ({ member, handleClose }) => {
  if (!member) return null

  return (
    <Box
      sx={{
        width: '34rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'whiteCorner',
        justifyContent: 'space-between',
      }}
      role="slide-over"
      data-cy="contact-member-detail"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          px: 3,
          color: 'colors.gray.400',
        }}
      >
        <Box display="flex" flexDirection="column" className="space-y-2">
          <Typography variant="h5" sx={{ color: 'colors.gray.800' }}>
            Fiche du militant
          </Typography>
        </Box>
        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          position: 'relative',
          flex: '1 1 0%',
          overflow: 'hidden',
          overflowY: 'scroll',
          height: '100%',
        }}
        className="scrolling-bar"
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '90px', bgcolor: 'colors.blue.900' }}>
          <div className="heading-banner"></div>
        </Box>
        <Box sx={{ px: 3, pt: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className="space-x-2">
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: 'colors.blue.500',
                border: '2px solid',
                borderColor: 'whiteCorner',
              }}
            >
              {member.firstname.split(' ')[0][0]} {member.lastname.split(' ')[0][0]}
            </Avatar>
            {member.joinedDate && differenceInDays(new Date(), member.joinedDate) <= 15 && <BadgeNew />}
          </Box>
          <Box sx={{ mt: 1 }} className="space-y-2">
            <Typography variant="h6" component="h4" sx={{ color: 'colors.gray.800' }}>
              {member.firstname} {member.lastname}
            </Typography>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'colors.gray.600' }}>
                <EmailOutlinedIcon sx={{ color: 'colors.gray.400', fontSize: '18px', mr: 1 }} />
                <Typography component="p" sx={{ mr: 1.5 }}>
                  {member.raw.email}
                </Typography>
                <Subscription subscription={member.raw.email_subscription} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'colors.gray.600', mt: 0.5 }}>
                <PhoneIphoneOutlinedIcon sx={{ color: 'colors.gray.400', fontSize: '18px', mr: 1 }} />
                {member.raw.phone_number ? (
                  <>
                    <Typography component="p" sx={{ mr: 1.5 }}>
                      {member.raw.phone_number}
                    </Typography>
                    <Subscription subscription={member.raw.sms_subscription} />
                  </>
                ) : (
                  <span>Aucune information</span>
                )}
              </Box>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }} className="space-y-4">
            <Box
              sx={{
                bgcolor: 'colors.gray.50',
                px: 2,
                py: 2.5,
                borderRadius: 2,
              }}
            >
              <Typography component="h4" sx={{ color: 'colors.gray.700', fontSize: '14px', mb: 1, fontWeight: '500' }}>
                Informations personnelles
              </Typography>
              <LineText label="Adresse complète" value={`${member.raw.address}, ${member.city} ${member.postalCode}`} />
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <LineText label="Nationalité" value={member.raw.nationality} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LineText label="Sexe" value={member.gender === 'male' ? 'Homme' : 'Femme'} />
                </Grid>
              </Grid>
            </Box>

            <Box
              sx={{
                bgcolor: 'colors.gray.50',
                px: 2,
                py: 2.5,
                borderRadius: 2,
              }}
            >
              <Typography component="h4" sx={{ color: 'colors.gray.700', fontSize: '14px', mb: 1, fontWeight: '500' }}>
                Informations globales
              </Typography>
              {member.committee && <LineText label="Comité" value={member.committee} />}
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <LineText
                    label="Renaissance"
                    value={
                      <MemberBadge membership={member.raw.renaissance_membership} labelStyle={{ fontSize: '14px' }} />
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LineText label="Date d'inscription" value={format(member.joinedDate, 'dd/MM/yyyy')} />
                </Grid>
              </Grid>
              <Box
                sx={{
                  borderTop: '1px solid',
                  borderTopColor: 'colors.gray.200',
                  pt: 0.5,
                  mt: 1,
                }}
              >
                <LineText
                  label="Intérêts"
                  value={
                    <Box display="flex" alignItems="center" flexWrap="wrap" className="space-x-2 space-y-1">
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
              </Box>
            </Box>

            <Box
              sx={{
                bgcolor: 'colors.gray.50',
                px: 2,
                py: 2.5,
                borderRadius: 2,
              }}
            >
              <Typography component="h4" sx={{ color: 'colors.gray.700', fontSize: '14px', mb: 1, fontWeight: '500' }}>
                Informations de cotisation
              </Typography>
              {member.contributingDate && (
                <LineText label="Date de dernière cotisation" value={format(member.contributingDate, 'dd/MM/yyyy')} />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Member

Member.propTypes = {
  member: Activist.propTypes,
  handleClose: PropTypes.func.isRequired,
}
