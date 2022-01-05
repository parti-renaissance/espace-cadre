import { Title, UIChip } from 'ui/Card'
import { format } from 'date-fns'
import { styled } from '@mui/system'
import GroupIcon from '@mui/icons-material/Group'
import { Box, Typography } from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { fr } from 'date-fns/locale'
import RoomIcon from '@mui/icons-material/Room'
import { TruncatedText } from 'components/shared/styled'
import { Event } from 'domain/event'
import noImage from 'assets/no-image.png'

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
`

const ParticipantsIcon = styled('div')`
  display: flex;
  align-items: center;
  font-size: 10px;
  font-weight: 500;
  border-radius: 19px;
  height: 18px;
  padding: ${({ theme }) => theme.spacing(0, 0.75)};
  border-color: ${({ theme }) => theme.palette.gray100};
  border: ${({ theme }) => `1px solid ${theme.palette.gray200}`};
  margin: ${({ theme }) => theme.spacing(0.25, 1, 0, 1)};
`

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
      <ParticipantsIcon>
        <GroupIcon sx={{ mr: 1, fontSize: '16px', fontWeight: '500' }} />
        {event.participants}
      </ParticipantsIcon>
    </HorizontalContainer>
    <Title subject={event.name} author={`Par ${event.organizer}`} sx={{ pt: 1 }} />
    <Box component="div" sx={{ display: 'flex', mt: 1 }}>
      <CalendarTodayIcon sx={{ mr: 1, fontSize: '16px', fontWeight: '500' }} />
      <Typography variant="subtitle2" sx={{ color: 'gray600', display: 'flex', alignSelf: 'center' }}>
        {format(event.beginAt, 'd MMM yyyy HH:mm', { locale: fr })}
      </Typography>
    </Box>
    <Box component="div" sx={{ display: 'flex', mt: 1 }}>
      <RoomIcon sx={{ mr: 1, fontSize: '16px', fontWeight: '500' }} />
      <TruncatedText
        title={formatAddress(event.address)}
        lines={3}
        variant="subtitle2"
        sx={{ color: 'gray600', height: '55px' }}
      >
        {formatAddress(event.address)}
      </TruncatedText>
    </Box>
  </>
)

Header.propTypes = {
  event: Event.propTypes.isRequired,
}

export default Header
