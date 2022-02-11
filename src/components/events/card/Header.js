import { Title, UIChip } from 'ui/Card'
import { format } from 'date-fns'
import { styled } from '@mui/system'
import GroupIcon from '@mui/icons-material/Group'
import { Box, Typography } from '@mui/material'
import MuiCalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { fr } from 'date-fns/locale'
import RoomIcon from '@mui/icons-material/Room'
import { TruncatedText } from 'components/shared/styled'
import { Event } from 'domain/event'
import noImage from 'assets/no-image.png'

const CalendarTodayIcon = styled(MuiCalendarTodayIcon)(
  ({ theme }) => `
  margin-right: ${theme.spacing(1)};
  color: ${theme.palette.gray500};
  font-size: 16px;
  font-weight: 500;
`
)

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
`

const AttendeesIcon = styled('div')(
  ({ theme }) => `
  display: flex;
  align-items: center;
  color: ${theme.palette.gray600};
  font-size: 10px;
  font-weight: 500;
  border-radius: 19px;
  height: 18px;
  padding: ${theme.spacing(0, 0.75)};
  border-color: ${theme.palette.gray100};
  border: ${`1px solid ${theme.palette.gray200}`};
  margin: ${theme.spacing(0.25, 1, 0, 1)};
`
)

const Image = styled('img')`
  object-fit: cover;
  margin: ${({ theme }) => theme.spacing(-2.75, -2, 2, -2)};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  height: 130px;
`

const NoImageContainer = styled('div')`
  margin: ${({ theme }) => theme.spacing(-2.75, -2, 2, -2)};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  height: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const BeginAtTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.gray600};
  display: flex;
  align-self: center;
`

export const formatAddress = ({ address, postalCode, city }) =>
  [address, address && ', ', postalCode, postalCode && ' ', city].filter(Boolean).join('')

const messages = {
  scheduled: 'À venir',
  canceled: 'Annulé',
}

const Header = ({ event }) => (
  <>
    {event.img ? (
      <Image src={event.img} />
    ) : (
      <NoImageContainer>
        <img src={noImage} height="100px" width="100px" alt="no image" />
      </NoImageContainer>
    )}
    <HorizontalContainer>
      <UIChip
        color={event.scheduled ? 'teal700' : 'red600'}
        bgcolor={event.scheduled ? 'activeLabel' : 'inactiveLabel'}
        label={event.scheduled ? messages.scheduled : messages.canceled}
      />
      <AttendeesIcon>
        <GroupIcon sx={{ mr: 1, fontSize: '16px', fontWeight: '500', color: 'gray500' }} />
        {event.attendees}
      </AttendeesIcon>
    </HorizontalContainer>
    <Title subject={event.name} author={`Par ${event.organizer}`} lines={2} sx={{ pt: 1 }} />
    <Box component="div" sx={{ display: 'flex', mt: 1 }}>
      <CalendarTodayIcon />
      <BeginAtTypography variant="subtitle2">
        {format(event.beginAt, 'd MMM yyyy HH:mm', { locale: fr })}
      </BeginAtTypography>
    </Box>
    <Box component="div" sx={{ display: 'flex', mt: 1 }}>
      <RoomIcon sx={{ mr: 1, fontSize: '16px', fontWeight: '500', color: 'gray500' }} />
      <TruncatedText lines={1} variant="subtitle2" sx={{ height: '55px', color: 'gray600' }}>
        {formatAddress(event.address)}
      </TruncatedText>
    </Box>
  </>
)

Header.propTypes = {
  event: Event.propTypes.isRequired,
}

export default Header
