import { styled } from '@mui/system'
import { Typography } from '@mui/material'

const ChartLegend = styled(props => <Typography component="li" {...props} />)`
  margin: ${({ theme }) => theme.spacing(2, 2, 2, 4)};
  font-size: 12px;
`
export default ChartLegend
