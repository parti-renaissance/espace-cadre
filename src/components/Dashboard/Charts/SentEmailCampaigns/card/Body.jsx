import { styled } from '@mui/system'

import { Statistics } from '~/domain/message'
import { UIChip } from '~/ui/Card'
import pluralize from '~/components/shared/pluralize/pluralize'

const HorizontalContainer = styled('div')`
  display: flex;
  flex-wrap: wrap;
`

const messages = {
  update: 'Modifier',
  email: 'email',
  sent: 'envoyé',
  open: 'lu',
  click: 'clic',
  unsubscribe: 'désabonnement',
}

const Body = ({ statistics }) => {
  const { sent, openings, openingRate, clicks, clickRate, unsubscribes, unsubscribeRate } = statistics
  const sx = { bgcolor: 'whiteCorner', border: '1px solid', borderColor: 'gray300', mt: 1, mr: 1 }
  return (
    <HorizontalContainer>
      <UIChip
        variant="outlined"
        label={`${sent} ${pluralize(sent, messages.email)} ${pluralize(sent, messages.sent)}`}
        sx={sx}
      />
      <UIChip
        variant="outlined"
        label={`${openings} ${pluralize(openings, messages.open)}`}
        title={`${openingRate}%`}
        sx={sx}
      />
      <UIChip
        variant="outlined"
        label={`${clicks} ${pluralize(clicks, messages.click)}`}
        title={`${clickRate}%`}
        sx={sx}
      />
      <UIChip
        variant="outlined"
        label={`${unsubscribes} ${pluralize(unsubscribes, messages.unsubscribe)}`}
        title={`${unsubscribeRate}%`}
        sx={{ ...sx, mr: 0 }}
      />
    </HorizontalContainer>
  )
}

Body.propTypes = {
  statistics: Statistics.propTypes.isRequired,
}

export default Body
