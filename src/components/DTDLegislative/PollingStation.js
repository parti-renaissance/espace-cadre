import { styled } from '@mui/system'
import { Grid, Chip, Typography } from '@mui/material'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import PropTypes from 'prop-types'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'

const messages = {
  voters: 'électeurs',
  addresses: 'Adresses',
}

const Container = styled(
  Grid,
  shouldForwardProps
)(
  ({ theme, isChecked }) => `
    display: flex;
    justify-content: flex-start;
    border: 1px solid ${isChecked ? theme.palette.main : 'rgba(0, 0, 0, 0.25)'};
    border-radius: 8px;
    padding: ${theme.spacing(2)};
    margin-bottom: ${theme.spacing(1)};
`
)

const Place = styled(Typography)(
  ({ theme }) => `
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    color: ${theme.palette.gray900};
    text-align: left;
    margin-right: ${theme.spacing(1)};
`
)

const Count = styled(Typography)(
  ({ theme }) => `
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: ${theme.palette.form.label.color};
      margin-right: ${theme.spacing(1)};
  `
)

const PollingStation = ({ pollingStation, handleSelectOne }) => (
  <Container container isChecked={pollingStation?.isChecked}>
    <Grid item>
      <Checkbox checked={pollingStation.isChecked} onChange={() => handleSelectOne(pollingStation.id)} />
    </Grid>
    <Grid item display="flex" flex={2} justifyContent="space-evenly" alignItems="center">
      <Chip label={pollingStation.tag} variant="outlined" sx={{ px: 1.5, py: 0.5, mr: 1 }} />
      <Place>{pollingStation.name}</Place>
      <Count>
        <Typography sx={{ fontWeight: 700 }}>{pollingStation.voters}</Typography>&nbsp;{messages.voters}
      </Count>
      <Count>
        <Typography sx={{ fontWeight: 700 }}>{pollingStation.addresses}</Typography>&nbsp;{messages.addresses}
      </Count>
    </Grid>
  </Container>
)

PollingStation.propTypes = {
  pollingStation: PropTypes.object,
  handleSelectOne: PropTypes.func,
}

export default PollingStation
