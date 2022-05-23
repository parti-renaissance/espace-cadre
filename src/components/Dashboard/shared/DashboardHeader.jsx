import { Grid, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { styled } from '@mui/system'

const CountBubble = styled('span')(
  ({ theme }) => `
  color: ${theme.palette.blueCorner};
  background-color: ${theme.palette.blueBubble};
  font-weight: 600;
  font-size: 18px;
  padding: ${theme.spacing(1)};
  margin-right: ${theme.spacing(1)};
  border-radius: 8px;
`
)

const DashboardHeader = ({ amount, title, subtitle }) => (
  <Grid container sx={{ p: 2 }}>
    <CountBubble>{amount}</CountBubble>
    <Grid item>
      <Typography variant="subtitle1" component="div" sx={{ color: 'blackCorner' }}>
        {title}
      </Typography>
      <Typography variant="subtitle2" component="div" sx={{ color: 'grayCorner3' }}>
        {subtitle}
      </Typography>
    </Grid>
  </Grid>
)

DashboardHeader.propTypes = {
  amount: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
}

export default DashboardHeader
