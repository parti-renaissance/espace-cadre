import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { Grid, Typography } from '@mui/material'

const Title = styled(Typography)(
  ({ theme }) => `
    font-size: 18px;
    font-weight: 500;
    color: ${theme.palette.blueCorner};
    margin-bottom: ${theme.spacing(2)};
`
)

const Kpi = styled(Typography)`
  fontsize: 16px;
  fontweight: 400;
`

const messages = {
  pollingStation: 'Bureau de vote',
  address: 'Adresse:',
  code: 'Code:',
}

const Popin = ({ address, code }) => (
  <Grid container flexDirection="column" sx={{ p: 1 }}>
    <Title>{messages.pollingStation}</Title>
    <Kpi sx={{ mb: 2 }}>
      <Typography component="span" sx={{ fontWeight: 600 }}>
        {messages.address}&nbsp;
      </Typography>
      {address}
    </Kpi>
    <Kpi>
      <Typography component="span" sx={{ fontWeight: 600 }}>
        {messages.code}&nbsp;
      </Typography>
      {code}
    </Kpi>
  </Grid>
)

Popin.propTypes = {
  address: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
}

export default Popin
