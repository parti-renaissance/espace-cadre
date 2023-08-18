import { Box, Typography } from '@mui/material'
import VerifiedIcon from '@mui/icons-material/Verified'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import PropTypes from 'prop-types'

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

export default Subscription

Subscription.propTypes = {
  subscription: PropTypes.bool.isRequired,
}
