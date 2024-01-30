import { Title, UIChip } from '~/ui/Card'
import { styled } from '@mui/system'
import { Attendee } from '~/domain/event'
import { formatDate } from '~/shared/helpers'

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
`

const messages = {
  activist: 'Adhérent',
  contact: 'Contact',
}

const Header = ({ attendee }) => (
  <>
    <HorizontalContainer>
      {attendee.isActivist ? (
        <UIChip color="colors.blue.500" bgcolor="colors.blue.50" label={messages.activist} />
      ) : (
        <UIChip color={'events.chip.color'} bgcolor={'events.chip.background'} label={messages.contact} />
      )}
    </HorizontalContainer>
    <Title
      subject={`${attendee.firstName} ${attendee.lastName}`}
      author={`${attendee.postalCode} • Le ${formatDate(attendee.subscriptionDate, 'dd MMMM yyyy à HH:mm ')}`}
      sx={{ pt: 1 }}
    />
  </>
)

Header.propTypes = {
  attendee: Attendee.propTypes.isRequired,
}

export default Header
