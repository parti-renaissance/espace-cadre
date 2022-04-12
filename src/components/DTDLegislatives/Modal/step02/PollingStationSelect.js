/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */

import { useState, useEffect } from 'react'
import { Container, Grid, Typography, FormControlLabel, Box, List } from '@mui/material'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import { styled } from '@mui/system'
import PollingStation from './PollingStation'
import PropTypes from 'prop-types'
import pluralize from '../../../shared/pluralize/pluralize'
import formatNumber from '../../../shared/formatNumber/formatNumber'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import { useCurrentDeviceType } from 'components/shared/device/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { getDTDCampaignPollingStations } from 'api/DTD'
import { useQueryWithScope } from 'api/useQueryWithScope'
import Loader from 'ui/Loader'

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

const PollingStationSelect = ({ formik, campaignId }) => {
  const [isCheck, setIsCheck] = useState([])
  const checkedCount = isCheck.length
  const { isMobile } = useCurrentDeviceType()
  const { handleError } = useErrorHandler()

  const { data: pollingStations = [] } = useQueryWithScope(
    ['polling-stations', { feature: 'DTD', view: 'PollingStations' }],
    getDTDCampaignPollingStations,
    {
      onError: handleError,
    }
  )

  const handleSelectAll = checked => {
    if (checked) {
      setIsCheck(pollingStations)
    } else {
      setIsCheck([])
    }
  }

  const handleSelectOne = (e, station) => {
    if (e.target.checked) {
      setIsCheck([...isCheck, station])
    } else {
      setIsCheck(isCheck.filter(item => item.id !== station.id))
    }
  }

  useEffect(() => {
    if (isCheck.length > 0) {
      formik.setFieldValue('votePlaces', isCheck)
    } else {
      formik.setFieldValue('votePlaces', [])
    }
  }, [isCheck])

  if (!pollingStations.length > 0)
    return (
      <Grid container justifyContent="center">
        <Loader />
      </Grid>
    )

  const votersCount = isCheck.reduce((total, currentValue) => total + currentValue.voters, 0)
  const addressesCount = isCheck.reduce((total, currentValue) => total + currentValue.addresses, 0)

  console.log(campaignId)

  return (
    <Container maxWidth="md">
      <Grid container sx={{ mt: 1, mb: 2 }}>
        <Title>{messages.title}</Title>
      </Grid>
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
              {checkedCount >= 0 && <Typography sx={{ fontWeight: 700 }}>{isCheck?.length}</Typography>}
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
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {pollingStations.length > 0 && (
          <Grid item xs={12} sx={{ maxHeight: '600px', overflowY: 'scroll' }}>
            {pollingStations?.map((station, index) => (
              <PollingStation
                key={index}
                station={station}
                handleSelectOne={handleSelectOne}
                index={index}
                isCheck={isCheck}
              />
            ))}
          </Grid>
        )}
      </List>
    </Container>
  )
}

PollingStationSelect.propTypes = {
  formik: PropTypes.object,
  campaignId: PropTypes.string,
}

export default PollingStationSelect
