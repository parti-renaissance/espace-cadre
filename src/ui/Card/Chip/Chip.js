import PropTypes from 'prop-types'
import { Chip as MuiChip, Typography } from '@mui/material'
import { styled } from '@mui/system'

const Label = styled(Typography)({
  fontSize: '10px',
  fontWeight: 500,
  lineHeight: '15px',
  '&.MuiChip-label': {
    paddingLeft: 0,
    paddingRight: 0,
  },
})

export const Chip = ({ label, color, bgcolor }) => (
  <MuiChip
    size="small"
    variant="filled"
    label={<Label sx={{ px: 1, py: 0.25 }}>{label}</Label>}
    sx={{ color, bgcolor, height: '19px', borderRadius: '19px' }}
  />
)

Chip.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  color: PropTypes.string,
  bgcolor: PropTypes.string,
}
