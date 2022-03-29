import { Grid, Typography, Box } from '@mui/material'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import { styled } from '@mui/system'
import { useState } from 'react'
import PollingStation from './PollingStation'
import PollingStations from './Data'

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
  const [isCheckAll, setIsCheckAll] = useState(false)
  const [isCheck, setIsCheck] = useState([])
  const checkedCount = isCheck.length
  const [votersCount] = useState(0)
  const [addressesCount] = useState(0)

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll)
    setIsCheck(PollingStations.map(station => station.id))
    if (isCheckAll) {
      setIsCheck([])
    }
  }

  const handleSelectOne = (e, id) => {
    setIsCheck([...isCheck, id])
    if (!e.target.checked) {
      setIsCheck(isCheck.filter(item => item !== id))
    }
  }

  return (
    <>
      {
        <Container container>
          <Grid item xs={12} sx={{ mb: 2, mt: 1 }}>
            <Title>{messages.title}</Title>
          </Grid>
          <Grid item xs={12} sx={{ mb: 2, mt: 1 }} display="flex" justifyContent="space-between" alignItems="center">
            <Box component="span">
              <Checkbox sx={{ ml: 1, mr: 1 }} checked={isCheckAll} onChange={handleSelectAll} />
              <Typography variant="subtitle1">
                {checkedCount >= 0 && <strong>{checkedCount}</strong>}&nbsp;
                {messages.selectedCount}
              </Typography>
            </Box>
            <Count>
              <strong>{votersCount}</strong>&nbsp;
              {messages.votersCount}
            </Count>
            <Count>
              <strong>{addressesCount}</strong>&nbsp;
              {messages.addressesCount}
            </Count>
          </Grid>
          {PollingStations.length > 0 && (
            <Grid item sx={{ width: '100%' }}>
              {PollingStations.map((pollingStation, index) => (
                <PollingStation
                  key={index}
                  pollingStation={pollingStation}
                  handleSelectOne={handleSelectOne}
                  index={index}
                  isCheck={isCheck}
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
