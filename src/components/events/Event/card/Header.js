import { Title, UIChip } from 'ui/Card'
import { format } from 'date-fns'
import { styled } from '@mui/system'
import { fr } from 'date-fns/locale'
import { Participant } from 'domain/event'

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
`

const messages = {
  activist: 'Adhérent',
  contact: 'Contact',
}

const Header = ({ participant }) => (
  <>
    <HorizontalContainer>
      {participant.isActivist ? (
        <UIChip color={'events.chip.color'} bgcolor={'events.chip.background'} label={messages.activist} />
      ) : (
        <UIChip color={'events.chip.color'} bgcolor={'events.chip.background'} label={messages.contact} />
      )}
    </HorizontalContainer>
    <Title
      subject={`${participant.firstName} ${participant.lastName}`}
      author={`${participant.postalCode} • Le ${format(participant.subscriptionDate, 'dd MMMM yyyy', { locale: fr })}`}
      sx={{ pt: 1 }}
    />
  </>
)

Header.propTypes = {
  participant: Participant.propTypes.isRequired,
}

export default Header
