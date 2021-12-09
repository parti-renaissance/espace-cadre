import { Typography } from '@mui/material'
import { styled } from '@mui/system'

export const VerticalContainer = styled('div')`
  display: flex;
  flex-direction: column;
`

export const TruncatedText = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
