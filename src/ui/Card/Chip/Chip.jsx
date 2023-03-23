import PropTypes from 'prop-types'
import { Chip as MuiChip, Typography } from '@mui/material'
import { styled } from '@mui/system'

const Label = styled(Typography)({
  fontSize: '10px',
  fontWeight: 500,
  lineHeight: '15px',
})

export const UIChip = ({ variant = 'filled', label, color, bgcolor, sx = {}, labelStyle = {}, ...props }) => (
  <MuiChip
    size="small"
    variant={variant}
    label={<Label sx={{ px: 1, py: 0.25, ...labelStyle }}>{label}</Label>}
    sx={{ color, bgcolor, borderRadius: '20px', ...sx }}
    {...props}
  />
)

UIChip.propTypes = {
  variant: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  color: PropTypes.string,
  bgcolor: PropTypes.string,
  sx: PropTypes.object,
  labelStyle: PropTypes.object,
}
