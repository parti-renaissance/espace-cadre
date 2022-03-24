import { styled } from '@mui/system'
import { Grid, Checkbox, Chip, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const messages = {
  voters: 'électeurs',
  addresses: 'Adresses',
}

const Container = styled(Grid)(
  ({ theme }) => `
    border: 1px solid rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: ${theme.spacing(2)};
    margin-bottom: ${theme.spacing(1)};
`
)

const Place = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  color: ${({ theme }) => theme.palette.gray900};
  text-align: left;
`

const Count = styled(Typography)(
  ({ theme }) => `
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: ${theme.palette.form.label.color};
  `
)

const PollingStation = ({ pollingStation, index, checked, handleChange }) => {
  const { id, tag, name, voters, addresses } = pollingStation

  return (
    <Container container>
      <Grid item>
        <Checkbox
          checked={checked[index]?.isChecked}
          onChange={() => handleChange(id, { id: id, isChecked: !checked[index]?.isChecked })}
        />
      </Grid>
      <Grid item display="flex" flex={1} justifyContent="space-between" alignItems="center">
        <Chip label={tag} variant="outlined" sx={{ px: 1.5, py: 0.5, mr: 2 }} />
        <Place>{name}</Place>
        <Count>
          <Typography sx={{ fontWeight: 700 }}>{voters}</Typography>&nbsp;{messages.voters}
        </Count>
        <Count>
          <Typography sx={{ fontWeight: 700 }}>{addresses}</Typography>&nbsp;{messages.addresses}
        </Count>
      </Grid>
    </Container>
  )
}

PollingStation.propTypes = {
  pollingStation: PropTypes.object,
  index: PropTypes.number,
  checked: PropTypes.array,
  handleChange: PropTypes.func,
}

export default PollingStation
