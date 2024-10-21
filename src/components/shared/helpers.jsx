import { Typography } from '@mui/material'

export const nl2br = (text, sx, limit = null) => {
  const paragraphs = text.split('\n')
  const displayableParagraphs = paragraphs.slice(0, limit || undefined)

  if (paragraphs.length !== displayableParagraphs.length) {
    displayableParagraphs[displayableParagraphs.length - 1] += ' ...'
  }

  return displayableParagraphs.map((str, idx) => (
    <Typography component="p" key={idx} sx={sx}>
      {str || '\u00A0'}
    </Typography>
  ))
}
