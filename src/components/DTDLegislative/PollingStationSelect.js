import { Grid, Typography, Checkbox, Box } from '@mui/material'
import { styled } from '@mui/system'
import { useEffect, useState } from 'react'
import PollingStation from './PollingStation'

const fakePollingStations = [
  {
    id: '1',
    tag: '#1',
    name: 'École élémentaire de la rue des fleurs',
    voters: 33,
    addresses: 54,
  },
  {
    id: '2',
    tag: '#2',
    name: 'Lycée de la rue des fleurs',
    voters: 33,
    addresses: 54,
  },
  {
    id: '3',
    tag: '#3',
    name: 'Collège de la rue des fleurs',
    voters: 33,
    addresses: 54,
  },
  {
    id: '4',
    tag: '#4',
    name: 'École élémentaire de la rue du Rocher',
    voters: 33,
    addresses: 54,
  },
  {
    id: '5',
    tag: '#5',
    name: 'Collège de la rue du Rocher',
    voters: 33,
    addresses: 54,
  },
  {
    id: '6',
    tag: '#6',
    name: 'Lycée de la rue du Rocher',
    voters: 33,
    addresses: 54,
  },
]

const messages = {
  title: 'Sélectionnez une liste de bureaux de vote',
  selectedCount: 'bureaux de votes sélectionnés',
  votersCount: 'électeurs',
  addressesCount: 'adresses',
}

const Container = styled(Grid)(
  ({ theme }) => `
    flex-direction: column;
    padding: ${theme.spacing(2)};
    background: ${theme.palette.whiteCorner};
    border-radius: 8px;
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
  const [checked, setChecked] = useState([])
  const [checkedCount] = useState(0)

  useEffect(() => {
    fakePollingStations.map(el => {
      setChecked(prevState => [...prevState, { id: el.id, isChecked: false }])
    })
  }, [])

  const handleChange = (id, updatedItem) => {
    const updatedCheckedState = checked.map(el => (el.id === id ? updatedItem : el))
    setChecked(updatedCheckedState)
  }

  return (
    <Container container>
      <Grid item xs={12} sx={{ mb: 2, mt: 1 }}>
        <Title>{messages.title}</Title>
      </Grid>
      <Grid item xs={12} sx={{ mb: 2, mt: 1 }} display="flex" justifyContent="space-between" alignItems="center">
        <Box component="span">
          <Checkbox sx={{ ml: 1, mr: 1 }} />
          <Typography variant="subtitle1">
            <strong>{checkedCount}</strong>&nbsp;
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
      {checked.length > 0 && (
        <Grid item>
          {fakePollingStations.map((pollingStation, index) => (
            <PollingStation
              key={index}
              pollingStation={pollingStation}
              checked={checked}
              setChecked={setChecked}
              handleChange={handleChange}
              index={index}
            />
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default PollingStationSelect

PollingStationSelect.propTypes = {
  formik: PropTypes.func,
}
