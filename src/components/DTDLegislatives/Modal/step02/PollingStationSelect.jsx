/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from 'react'
import { Container, Grid, Typography, FormControlLabel, Box } from '@mui/material'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import { styled } from '@mui/system'
import PollingStation from './PollingStation'
import PropTypes from 'prop-types'
import pluralize from '../../../shared/pluralize/pluralize'
import formatNumber from '../../../shared/formatNumber/formatNumber'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import { useCurrentDeviceType } from 'components/shared/device/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { getDTDCampaignPollingStations, getDTDCampaignSelectedPollingStations } from 'api/DTD'
import Loader from 'ui/Loader'
import UIFormMessage from 'ui/FormMessage/FormMessage'
import { FixedSizeList as List } from 'react-window'
import { useMutation } from '@tanstack/react-query'
import { useQueryWithScope } from 'api/useQueryWithScope'
import MapContext from 'providers/context'

const messages = {
  title: 'Sélectionnez une liste de bureaux de vote',
  pollStationPrefix: 'bureau',
  pollStation: 'de vote',
  pollStationSuffix: 'sélectionné',
  votersCount: 'électeur',
  addressesCount: 'adresse',
}

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

const PollingStationSelect = ({ formik, campaignId, errorMessages }) => {
  const { isMobile } = useCurrentDeviceType()
  const { handleError } = useErrorHandler()
  const { pollingStationSelection, setPollingStationSelection } = useContext(MapContext)

  const { data: pollingStations = [] } = useQueryWithScope(
    ['polling-stations', { feature: 'DTD', view: 'PollingStations' }],
    () => getDTDCampaignPollingStations(campaignId),
    {
      onError: handleError,
    }
  )

  const { mutateAsync: getSelectedPollingStations } = useMutation(getDTDCampaignSelectedPollingStations, {
    onSuccess: data => {
      if (data?.length > 0) {
        setPollingStationSelection(data.map(element => element.code))
      }
    },
    onError: handleError,
  })

  const handleSelectAll = checked => {
    setPollingStationSelection(checked ? pollingStations.map(element => element.code) : [])
  }

  const handleSelectOne = (e, station) => {
    if (e.target.checked) {
      setPollingStationSelection([...pollingStationSelection, station.code])
    } else {
      setPollingStationSelection(pollingStationSelection.filter(item => item !== station.code))
    }
  }

  const getPollingStationsFromCodes = (list, codes) => list.filter(element => codes.includes(element.code))

  const transformPollingStations = (data, selection) =>
    getPollingStationsFromCodes(data, selection).map(element => element.id)

  useEffect(() => {
    formik.setFieldValue('votePlaces', transformPollingStations(pollingStations, pollingStationSelection))
  }, [pollingStationSelection])

  useEffect(() => {
    if (campaignId && pollingStations.length > 0) {
      getSelectedPollingStations(campaignId)
    }
  }, [campaignId, pollingStations])

  if (!pollingStations.length > 0 || !campaignId) {
    return (
      <Grid container justifyContent="center">
        <Loader />
      </Grid>
    )
  }

  const list = getPollingStationsFromCodes(pollingStations, pollingStationSelection)
  const votersCount = list.reduce((total, currentValue) => total + currentValue.voters, 0)
  const addressesCount = list.reduce((total, currentValue) => total + currentValue.addresses, 0)

  return (
    <Container maxWidth="md">
      <Grid container sx={{ mt: 1, mb: 2 }}>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Title>{messages.title}</Title>
        </Grid>
      </Grid>
      {errorMessages.map(({ message, index }) => (
        <Grid item xs={12} key={index}>
          <UIFormMessage severity="error">{message}</UIFormMessage>
        </Grid>
      ))}
      <CountContainer container isMobile={isMobile}>
        <FormControlLabel
          control={
            <Checkbox
              checked={pollingStationSelection.length === pollingStations.length}
              onChange={e => handleSelectAll(e.target.checked)}
            />
          }
          label={
            <Typography variant="subtitle1">
              <Typography
                sx={{ fontWeight: 700 }}
              >{`${pollingStationSelection.length}/${pollingStations.length}`}</Typography>
              &nbsp;
              {pluralize(pollingStationSelection.length, messages.pollStationPrefix, 'x')}&nbsp;
              {messages.pollStation}&nbsp;{pluralize(pollingStationSelection.length, messages.pollStationSuffix)}
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
      <List
        height={600}
        itemCount={pollingStations.length}
        itemData={pollingStations.sort(
          (a, b) => pollingStationSelection.includes(b.code) - pollingStationSelection.includes(a.code)
        )}
        itemSize={isMobile ? 120 : 68}
      >
        {({ data, index, style }) => {
          const station = data[index]
          return (
            <div style={style}>
              <PollingStation
                key={station.id}
                station={station}
                handleSelectOne={handleSelectOne}
                isCheck={pollingStationSelection.includes(station.code)}
              />
            </div>
          )
        }}
      </List>
    </Container>
  )
}

PollingStationSelect.propTypes = {
  formik: PropTypes.object,
  campaignId: PropTypes.string,
  errorMessages: PropTypes.array,
}

export default PollingStationSelect
