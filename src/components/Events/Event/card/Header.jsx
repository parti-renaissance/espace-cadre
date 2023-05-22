import { Title, UIChip } from 'ui/Card'
import { format } from 'date-fns'
import { styled } from '@mui/system'
import { fr } from 'date-fns/locale'
import { Attendee } from 'domain/event'

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
      author={`${attendee.postalCode} • Le ${format(attendee.subscriptionDate, 'dd MMMM yyyy à HH:mm ', {
        locale: fr,
      })}`}
      sx={{ pt: 1 }}
    />
  </>
)

Header.propTypes = {
  attendee: Attendee.propTypes.isRequired,
}

export default Header
