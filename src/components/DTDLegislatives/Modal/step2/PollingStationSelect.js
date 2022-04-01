/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Grid, Typography, FormControlLabel, Box } from '@mui/material'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import { styled } from '@mui/system'
import PollingStation from './PollingStation'
import PollingStations from '../../Data/ModalData'
import PropTypes from 'prop-types'
import pluralize from '../../../shared/pluralize/pluralize'
import formatNumber from '../../../shared/formatNumber/formatNumber'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import { useCurrentDeviceType } from 'components/shared/device/hooks'

const messages = {
  title: 'Sélectionnez une liste de bureaux de vote',
  pollStationPrefix: 'bureau',
  pollStation: 'de vote',
  pollStationSuffix: 'sélectionné',
  votersCount: 'électeur',
  addressesCount: 'adresse',
}

const Container = styled(
  Grid,
  shouldForwardProps
)(
  ({ theme, isMobile }) => `
    padding: ${isMobile ? 0 : theme.spacing(2)};
    background: ${theme.palette.whiteCorner};
    border-radius: 8px;
    height: 90vh;
    overflow-y: scroll;
    margin-bottom: ${theme.spacing(2)};
`
)

const CountContainer = styled(
  Grid,
  shouldForwardProps
)(
  ({ theme, isMobile }) => `
  display: flex;
  flex-direction: ${isMobile ? 'column' : 'row'};
  align-items: ${isMobile ? 'start' : 'center'};
  width: 100%;
  margin: ${theme.spacing(1, 0, 2)};
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

const PollingStationSelect = ({ formik }) => {
  const [isCheckAll, setIsCheckAll] = useState(false)
  const [isCheck, setIsCheck] = useState([])
  const [votersCount, setVotersCount] = useState(0)
  const [addressesCount, setAddressesCount] = useState(0)
  const checkedCount = isCheck.length
  const { isMobile } = useCurrentDeviceType()

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

  useEffect(() => {
    const votersToSum = PollingStations.filter(station => isCheck.includes(station.id)).reduce(
      (total, currentValue) => total + currentValue.voters,
      0
    )
    const addressesToSum = PollingStations.filter(station => isCheck.includes(station.id)).reduce(
      (total, currentValue) => total + currentValue.addresses,
      0
    )
    setVotersCount(votersToSum)
    setAddressesCount(addressesToSum)

    if (isCheck.length > 0) {
      formik.setFieldValue('isCheck', isCheck)
    } else {
      formik.setFieldValue('isCheck', [])
    }
  }, [isCheck])

  return (
    <>
      {
        <Container container isMobile={isMobile}>
          <Grid item xs={12} sx={{ mt: 1, mb: 2 }}>
            <Title>{messages.title}</Title>
          </Grid>
          <CountContainer container isMobile={isMobile}>
            <FormControlLabel
              control={<Checkbox checked={isCheckAll} onChange={handleSelectAll} />}
              label={
                <Typography variant="subtitle1">
                  {checkedCount >= 0 && <Typography sx={{ fontWeight: 700 }}>{checkedCount}</Typography>}
                  &nbsp;
                  {pluralize(checkedCount, messages.pollStationPrefix, 'x')}&nbsp;
                  {messages.pollStation}&nbsp;{pluralize(checkedCount, messages.pollStationSuffix)}
                </Typography>
              }
              sx={{ mr: 1, mb: 1 }}
            />
            <Box component="span" sx={{ mr: 1, mb: 1 }}>
              <Typography sx={{ fontWeight: 700 }}>{formatNumber(votersCount)}</Typography>&nbsp;
              <Count>{pluralize(votersCount, messages.votersCount)}</Count>
            </Box>
            <Box component="span" sx={{ mb: 1 }}>
              <Typography sx={{ fontWeight: 700 }}>{formatNumber(addressesCount)}</Typography>&nbsp;
              <Count>{pluralize(addressesCount, messages.addressesCount)}</Count>
            </Box>
          </CountContainer>
          {PollingStations.length > 0 && (
            <Grid item xs={12}>
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

PollingStationSelect.propTypes = {
  formik: PropTypes.object,
}

export default PollingStationSelect
