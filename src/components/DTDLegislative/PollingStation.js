import { styled } from '@mui/system'
import { Grid, Chip, Typography } from '@mui/material'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import PropTypes from 'prop-types'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import { useCurrentDeviceType } from 'components/shared/device/hooks'
import formatNumber from '../shared/formatNumber/formatNumber'

const messages = {
  voters: 'électeurs',
  addresses: 'Adresses',
}

const Container = styled(
  Grid,
  shouldForwardProps
)(
  ({ theme, hasBorderColor, isMobile }) => ` 
  display: flex;
  flex-direction: ${isMobile ? 'column' : 'row'};
  align-items: center;
  border: 1px solid ${hasBorderColor ? theme.palette.main : 'rgba(0, 0, 0, 0.25)'};
  border-radius: 8px;
  padding: ${theme.spacing(2)};
  margin-bottom: ${theme.spacing(1)};
  height: auto;
`
)

const SecondaryContainer = styled(Grid)(
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

const PollingStation = ({ pollingStation, handleSelectOne, isCheck }) => {
  const hasBorderColor = isCheck.includes(pollingStation.id)
  const { isMobile } = useCurrentDeviceType()

  return (
    <Container container hasBorderColor={hasBorderColor} isMobile={isMobile} spacing={1}>
      <Checkbox checked={isCheck.includes(pollingStation?.id)} onChange={e => handleSelectOne(e, pollingStation.id)} />
      <Chip
        label={pollingStation.tag}
        variant="outlined"
        size="small"
        sx={{ px: 1.5, py: 0.5, mr: 1, ...(isMobile && { mb: 1 }) }}
      />
      <SecondaryContainer item isMobile={isMobile}>
        <Place sx={{ ...(isMobile && { mb: 1 }) }}>{pollingStation.name}</Place>
        <Count sx={{ ...(isMobile && { mb: 1 }) }}>
          <Typography sx={{ fontWeight: 700 }}>{formatNumber(pollingStation.voters)}</Typography>&nbsp;{messages.voters}
        </Count>
        <Count sx={{ ...(isMobile && { mb: 1 }) }}>
          <Typography sx={{ fontWeight: 700 }}>{formatNumber(pollingStation.addresses)}</Typography>&nbsp;
          {messages.addresses}
        </Count>
      </SecondaryContainer>
    </Container>
  )
}

PollingStation.propTypes = {
  pollingStation: PropTypes.object,
  handleSelectOne: PropTypes.func,
  isCheck: PropTypes.array,
}

export default PollingStation
