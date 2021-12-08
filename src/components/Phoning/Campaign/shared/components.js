import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

export const CardRootWrapper = styled(props => <Grid container alignItems="center" {...props} />)`
  min-height: 125px;
  border-radius: 8.35px;
`
export const CardContentWrapper = styled(props => <Grid container direction="column" {...props} />)(({ theme }) => ({
  padding: `${theme.spacing(0, 2, 0, 2)} !important`,
  '&:last-child': {
    padding: `${theme.spacing(0, 2, 0, 2)}`,
  },
}))
export const TruncatedText = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
