import { Typography } from '@mui/material'
import { styled } from '@mui/system'

export const TruncatedText = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
