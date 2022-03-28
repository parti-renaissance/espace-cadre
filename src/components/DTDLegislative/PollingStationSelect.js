import { Grid, Typography, Checkbox, Box } from '@mui/material'
import { styled } from '@mui/system'
import { useState, useEffect } from 'react'
import PollingStation from './PollingStation'
import fakePollingStations from './Data'

const messages = {
  title: 'Sélectionnez une liste de bureaux de vote',
  selectedCount: 'bureaux de votes sélectionnés',
  votersCount: 'électeurs',
  addressesCount: 'adresses',
}

const Container = styled(Grid)(
  ({ theme }) => `
    flex-direction: row;
    padding: ${theme.spacing(2)};
    background: ${theme.palette.whiteCorner};
    border-radius: 8px;
    height: 90vh;
    overflow: scroll;
`
)

const Title = styled(Typography)(
  ({ theme }) => `
    font-size: 18px;
    font-weight: 400;
    line-height: 27px;
    color: ${theme.palette.gray800};
`
)

const Count = styled(Typography)(
  ({ theme }) => `
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    color: ${theme.palette.form.label.color};
`
)

const PollingStationSelect = () => {
  const [allChecked, setAllChecked] = useState(false)
  const [checkboxesState, setCheckboxesState] = useState([])
  const checkedCount = checkboxesState.filter(val => val.isChecked).length

  const handleMainCheckboxChange = event => {
    setAllChecked(event.target.checked)
    checkboxesState.map(el => (el.isChecked = !el.isChecked))
  }

  const handleIndividualCheckboxChange = (id, updatedItem) => {
    const updatedCheckedState = checkboxesState.map(el => (el.id === id ? updatedItem : el))
    setCheckboxesState(updatedCheckedState)
  }

  useEffect(() => {
    fakePollingStations.map(el => {
      setCheckboxesState(prevState => [...prevState, { id: el.id, isChecked: false }])
    })
  }, [])

  return (
    <>
      {
        <Container container>
          <Grid item xs={12} sx={{ mb: 2, mt: 1 }}>
            <Title>{messages.title}</Title>
          </Grid>
          <Grid item xs={12} sx={{ mb: 2, mt: 1 }} display="flex" justifyContent="space-between" alignItems="center">
            <Box component="span">
              <Checkbox sx={{ ml: 1, mr: 1 }} checked={allChecked} onChange={handleMainCheckboxChange} />
              <Typography variant="subtitle1">
                {checkedCount >= 0 && <strong>{checkedCount}</strong>}&nbsp;
                {messages.selectedCount}
              </Typography>
            </Box>
            <Count>
              <strong>X</strong>&nbsp;
              {messages.votersCount}
            </Count>
            <Count>
              <strong>X</strong>&nbsp;
              {messages.addressesCount}
            </Count>
          </Grid>
          {checkboxesState.length > 0 && (
            <Grid item sx={{ width: '100%' }}>
              {fakePollingStations.map((pollingStation, index) => (
                <PollingStation
                  key={index}
                  pollingStation={pollingStation}
                  checkboxesState={checkboxesState}
                  handleIndividualCheckboxChange={handleIndividualCheckboxChange}
                  index={index}
                />
              ))}
            </Grid>
          )}
        </Container>
      }
    </>
  )
}

export default PollingStationSelect

PollingStationSelect.propTypes = {
  formik: PropTypes.func,
}
