import { Typography } from '@mui/material'
import { styled } from '@mui/system'

export const VerticalContainer = styled('div')`
  display: flex;
  flex-direction: column;
`
export const HorizontalContainer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const TruncatedText = styled(Typography)(
  ({ lines = 1 }) => `
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${lines};
  white-space: normal;
`
)
