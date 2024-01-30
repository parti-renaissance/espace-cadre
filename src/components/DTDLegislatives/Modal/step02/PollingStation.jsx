import { styled } from '@mui/system'
import { Grid, Typography, ListItemButton } from '@mui/material'
import { Checkbox } from '~/ui/Checkbox/Checkbox'
import PropTypes from 'prop-types'
import { shouldForwardProps } from '~/components/shared/shouldForwardProps'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import formatNumber from '../../../shared/formatNumber/formatNumber'

const messages = {
  voters: 'électeurs',
  addresses: 'Adresses',
}

const ListItem = styled(
  ListItemButton,
  shouldForwardProps
)(
  ({ theme, hasBorderColor, isMobile }) => `
  display: flex;
  flex-direction: ${isMobile ? 'column' : 'row'};
  align-items: center;
  border-radius: 8px;
  &.MuiListItemButton-root {
    border: 1px solid ${hasBorderColor ? theme.palette.main : 'rgba(0, 0, 0, 0.25)'};
  }
`
)

const SecondaryContainer = styled(
  Grid,
  shouldForwardProps
)(
  ({ isMobile }) => `
  display: flex;
  justify-content: ${isMobile ? 'start' : 'space-evenly'};
  flex-direction: ${isMobile ? 'column' : 'row'};
  align-items: center;
  width: 100%;
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

const PollingStation = ({ station, handleSelectOne, isCheck }) => {
  const { isMobile } = useCurrentDeviceType()

  return (
    <ListItem hasBorderColor={isCheck} onClick={e => handleSelectOne(e, station)}>
      <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Checkbox checked={isCheck} />
      </Grid>
      <SecondaryContainer item isMobile={isMobile}>
        <Place sx={{ ...(isMobile && { mb: 1 }) }}>{station.code}</Place>
        <Count sx={{ ...(isMobile && { mb: 1 }) }}>
          <Typography sx={{ fontWeight: 700 }}>{formatNumber(station.voters)}</Typography>&nbsp;
          {messages.voters}
        </Count>
        <Count sx={{ ...(isMobile && { mb: 1 }) }}>
          <Typography sx={{ fontWeight: 700 }}>{formatNumber(station.addresses)}</Typography>&nbsp;
          {messages.addresses}
        </Count>
      </SecondaryContainer>
    </ListItem>
  )
}

PollingStation.propTypes = {
  station: PropTypes.object,
  handleSelectOne: PropTypes.func,
  isCheck: PropTypes.bool,
}

export default PollingStation
