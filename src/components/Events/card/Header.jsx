import { Title } from 'ui/Card'
import { styled } from '@mui/system'
import GroupIcon from '@mui/icons-material/Group'
import { Box, Typography } from '@mui/material'
import MuiCalendarTodayIcon from '@mui/icons-material/CalendarToday'
import RoomIcon from '@mui/icons-material/Room'
import TagIcon from '@mui/icons-material/LocalOffer'
import { TruncatedText } from 'components/shared/styled'
import { Event } from 'domain/event'
import noImage from 'assets/no-image.png'
import EventChip from './EventChip'
import PropTypes from 'prop-types'
import { formatDate } from 'shared/helpers'

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

const LabelTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.gray600};
  display: flex;
  align-self: center;
`

export const formatAddress = ({ route, postalCode, locality }) =>
  [route, route && ', ', postalCode, postalCode && ' ', locality].filter(Boolean).join('')
const Header = ({ event, categoryNameByCategoryId }) => (
  <>
    {event.image ? (
      <Image src={event.image} />
    ) : (
      <NoImageContainer>
        <img src={noImage} height="100px" width="100px" alt="no image" />
      </NoImageContainer>
    )}
    <HorizontalContainer>
      <EventChip event={event} />
      <AttendeesIcon>
        <GroupIcon sx={{ mr: 1, fontSize: '16px', fontWeight: '500', color: 'gray500' }} />
        {event.attendees}
      </AttendeesIcon>
    </HorizontalContainer>
    <Title subject={event.name} author={`Par ${event.organizer}`} lines={2} sx={{ pt: 1 }} />
    <Box component="div" sx={{ display: 'flex', mt: 1 }}>
      <CalendarTodayIcon />
      <LabelTypography variant="subtitle2">{formatDate(event.beginAt, 'd MMM yyyy HH:mm')}</LabelTypography>
    </Box>
    {event.address && !event.address.isEmpty() && (
      <Box component="div" sx={{ display: 'flex', mt: 1 }}>
        <RoomIcon sx={{ mr: 1, fontSize: '16px', fontWeight: '500', color: 'gray500' }} />
        <TruncatedText
          lines={2}
          variant="subtitle2"
          sx={{ height: '35px', color: 'gray600' }}
          title={formatAddress(event.address)}
        >
          {formatAddress(event.address)}
        </TruncatedText>
      </Box>
    )}
    <Box component="div" sx={{ display: 'flex', mt: 0.5 }}>
      <TagIcon sx={{ mr: 1, fontSize: '16px', fontWeight: '500', color: 'gray500' }} />
      <LabelTypography variant="subtitle2">{categoryNameByCategoryId?.[event.categoryId]}</LabelTypography>
    </Box>
  </>
)

Header.propTypes = {
  event: Event.propTypes.isRequired,
  categoryNameByCategoryId: PropTypes.object.isRequired,
}

export default Header
