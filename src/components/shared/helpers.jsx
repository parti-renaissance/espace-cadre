import { Typography } from '@mui/material'

export const nl2br = (text, sx) =>
  text.split('\n').map((str, idx) => (
    <Typography component="p" key={idx} sx={{ mb: 1, ...sx }}>
      {str}
    </Typography>
  ))
