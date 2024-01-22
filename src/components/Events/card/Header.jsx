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
import CardMedia from '@mui/material/CardMedia'
import { UIChip } from 'src/ui/Card'

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
  gap: ${({ theme }) => theme.spacing(1)};
  align-items: center;
`

const LabelTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.gray600};
  display: flex;
  align-self: center;
`

const CardMediaPlaceholderContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const formatAddress = ({ route, postalCode, locality }) =>
  [route, route && ', ', postalCode, postalCode && ' ', locality].filter(Boolean).join('')
const Header = ({ event, categoryNameByCategoryId }) => (
  <>
    <CardMediaPlaceholderContainer>
      {event.image ? (
        <CardMedia sx={{ borderRadius: '4px' }} component="img" height={130} image={event.image} />
      ) : (
        <img height={130} src={noImage} />
      )}
    </CardMediaPlaceholderContainer>
    <br />
    <HorizontalContainer>
      <EventChip event={event} />
      <UIChip
        sx={{ pl: 1 }}
        icon={<GroupIcon sx={{ fontWeight: '500', color: 'gray500' }} />}
        variant="outlined"
        label={event.attendees}
        size="small"
      />
    </HorizontalContainer>
    <Title subject={event.name} author={`Par ${event.organizer}`} lines={2} sx={{ pt: 1 }} />
    <Box component="div" sx={{ display: 'flex', mt: 1 }}>
      <CalendarTodayIcon />
      <LabelTypography variant="subtitle2">{formatDate(event.beginAt, 'd MMM yyyy HH:mm')}</LabelTypography>
    </Box>
    {event.address && !event.address.isEmpty() && (
      <Box component="div" sx={{ display: 'flex', mt: 1 }}>
        <RoomIcon sx={{ mr: 1, fontSize: '16px', fontWeight: '500', color: 'gray500' }} />
        <TruncatedText lines={2} variant="subtitle2" sx={{ color: 'gray600' }} title={formatAddress(event.address)}>
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
