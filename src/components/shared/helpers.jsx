import { Typography } from '@mui/material'

export const nl2br = (text, sx, limit = null) => {
  const paragraphs = text.split('\n').map((str, idx) => {
    const index = idx + 1

    if (limit) {
      return (
        <Typography component="p" key={idx} sx={{ mb: 1, ...(index > limit ? { display: 'none' } : null), ...sx }}>
          {str} {index === limit ? '....' : ''}
        </Typography>
      )
    }

    return (
      <Typography component="p" key={idx} sx={{ mb: 1, ...sx }}>
        {str}
      </Typography>
    )
  })

  return paragraphs
}
