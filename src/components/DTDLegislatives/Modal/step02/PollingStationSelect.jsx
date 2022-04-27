/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from 'react'
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
import { useMutation } from 'react-query'
import { useQueryWithScope } from 'api/useQueryWithScope'
import MapContext from '../../MapContext'

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
  const [isCheck, setIsCheck] = useState([])
  const [selected, setSelected] = useState([])
  const checkedCount = isCheck.length
  const { isMobile } = useCurrentDeviceType()
  const { handleError } = useErrorHandler()
  const { pollingStationCode, setPollingStationCode } = useContext(MapContext)

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
        setSelected(data)
      }
    },
    onError: handleError,
  })

  const handleSelectAll = checked => {
    if (checked) {
      setIsCheck(pollingStations)
    } else {
      setIsCheck([])
    }
  }

  const handleSelectOne = (e, station) => {
    if (e.target.checked) {
      station.isChecked = true
      setIsCheck([...isCheck, station])
    } else {
      station.isChecked = false
      setIsCheck(isCheck.filter(item => item.id !== station.id))
    }
  }

  const transformPollingStations = data => {
    const transformed = []
    data.forEach(element => {
      transformed.push(element.id)
    })
    return transformed
  }

  const mergePollingStations = () => {
    const mergedSelection = []
    pollingStations.forEach(element => {
      selected.forEach(item => {
        if (item.id === element.id) {
          element.isChecked = true
          mergedSelection.push(element)
        }
      })
    })
    setIsCheck(mergedSelection)
  }

  const handleMapSelectOne = () => {
    const station = pollingStations.filter(item => item.code === pollingStationCode)[0]
    if (!station) return
    if (!station.isChecked) {
      station.isChecked = true
      setIsCheck([...isCheck, station])
    } else {
      station.isChecked = false
      setIsCheck(isCheck.filter(item => item.id !== station.id))
    }
    setPollingStationCode(null)
  }

  const moveItemsToTheTop = (a, b) => Number(b.isChecked) - Number(a.isChecked)

  useEffect(() => {
    if (isCheck.length > 0) {
      formik.setFieldValue('votePlaces', transformPollingStations(isCheck))
    } else {
      formik.setFieldValue('votePlaces', [])
    }
  }, [isCheck])

  useEffect(() => {
    if (campaignId && pollingStations.length > 0) {
      getSelectedPollingStations(campaignId)
    }
  }, [campaignId, pollingStations])

  useEffect(() => {
    if (selected.length > 0) {
      mergePollingStations()
    }
  }, [selected])

  useEffect(() => {
    if (pollingStationCode && pollingStations.length > 0) {
      handleMapSelectOne()
    }
  }, [pollingStationCode])

  if (!pollingStations.length > 0 || !campaignId)
    return (
      <Grid container justifyContent="center">
        <Loader />
      </Grid>
    )

  const votersCount = isCheck.reduce((total, currentValue) => total + currentValue.voters, 0)
  const addressesCount = isCheck.reduce((total, currentValue) => total + currentValue.addresses, 0)

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
              checked={isCheck.length === pollingStations.length}
              onChange={e => handleSelectAll(e.target.checked)}
            />
          }
          label={
            <Typography variant="subtitle1">
              {checkedCount >= 0 && (
                <Typography sx={{ fontWeight: 700 }}>{`${isCheck?.length}/${pollingStations.length}`}</Typography>
              )}
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
      <List
        height={600}
        itemCount={pollingStations.length}
        itemData={pollingStations.sort(moveItemsToTheTop)}
        itemSize={isMobile ? 120 : 68}
      >
        {({ data, index, style }) => {
          const station = data[index]
          return (
            <div style={style}>
              <PollingStation key={station.id} station={station} handleSelectOne={handleSelectOne} isCheck={isCheck} />
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
