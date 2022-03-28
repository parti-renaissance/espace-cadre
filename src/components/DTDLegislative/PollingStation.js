import { styled } from '@mui/system'
import { Grid, Checkbox, Chip, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const messages = {
  voters: 'électeurs',
  addresses: 'Adresses',
}

const Container = styled(Grid)(
  ({ theme }) => `
    display: flex;
    justify-content: flex-start;
    border: 1px solid rgba(0, 0, 0, 0.25);
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

const PollingStation = ({ pollingStation, index, checkboxesState, handleIndividualCheckboxChange }) => {
  const { id, tag, name, voters, addresses } = pollingStation

  return (
    <Container container>
      <Grid item>
        <Checkbox
          checked={checkboxesState[index]?.isChecked}
          onChange={() => handleIndividualCheckboxChange(id, { id: id, isChecked: !checkboxesState[index]?.isChecked })}
        />
      </Grid>
      <Grid item display="flex" justifyContent="space-evenly" alignItems="center" sx={{ width: '90%' }}>
        <Chip label={tag} variant="outlined" sx={{ px: 1.5, py: 0.5, mr: 1 }} />
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
  checkboxesState: PropTypes.array,
  handleChange: PropTypes.func,
}

export default PollingStation
