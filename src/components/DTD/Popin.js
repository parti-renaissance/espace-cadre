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
  priority: 'Priorité:',
}

const Popin = ({ address, code, priority }) => (
  <Grid container flexDirection="column" sx={{ p: 1 }}>
    <Title>{messages.pollingStation}</Title>
    <Kpi sx={{ mb: 1 }}>
      <Typography component="span" sx={{ fontWeight: 600 }}>
        {messages.address}&nbsp;
      </Typography>
      {address}
    </Kpi>
    <Kpi sx={{ mb: 1 }}>
      <Typography component="span" sx={{ fontWeight: 600 }}>
        {messages.code}&nbsp;
      </Typography>
      {code}
    </Kpi>
    <Kpi>
      <Typography component="span" sx={{ fontWeight: 600 }}>
        {messages.priority}&nbsp;
      </Typography>
      {priority}
    </Kpi>
  </Grid>
)

Popin.propTypes = {
  address: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
}

export default Popin
