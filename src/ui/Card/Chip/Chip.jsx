import PropTypes from 'prop-types'
import { Chip as MuiChip, Tooltip, Typography } from '@mui/material'
import { styled } from '@mui/system'

const Label = styled(Typography)({
  fontSize: '10px',
  fontWeight: 500,
  lineHeight: '15px',
})

export const UIChip = ({
  variant = 'filled',
  label,
  color,
  bgcolor,
  help = null,
  sx = {},
  labelStyle = {},
  ...props
}) => {
  const chip = (
    <MuiChip
      size="small"
      variant={variant}
      label={<Label sx={{ px: 1, py: 0.25, ...labelStyle }}>{label}</Label>}
      sx={{ color, bgcolor, borderRadius: '20px', ...sx }}
      {...props}
    />
  )

  if (help) {
    return (
      <Tooltip title={help} placement="top" arrow>
        {chip}
      </Tooltip>
    )
  }

  return chip
}

UIChip.propTypes = {
  variant: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  color: PropTypes.string,
  bgcolor: PropTypes.string,
  help: PropTypes.string,
  sx: PropTypes.object,
  labelStyle: PropTypes.object,
}
