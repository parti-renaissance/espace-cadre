import { styled } from '@mui/system'

import { Statistics } from 'domain/message'
import { Chip as UIChip } from 'ui/Card'

const HorizontalContainer = styled('div')`
  display: flex;
  flex-wrap: wrap;
`

const messages = {
  update: 'Modifier',
  emails: 'emails envoyés',
  open: 'lus',
  click: 'clics',
  unsubscribe: 'désabonnements',
}

const Body = ({ statistics }) => {
  const { sent, openings, openingRate, clicks, clickRate, unsubscribes, unsubscribeRate } = statistics
  const sx = { bgcolor: 'whiteCorner', border: '1px solid', borderColor: 'gray300', mt: 1, mr: 1 }
  return (
    <HorizontalContainer>
      <UIChip variant="outlined" label={`${sent} ${messages.emails}`} sx={sx} />
      <UIChip variant="outlined" label={`${openings} ${messages.open}`} title={`${openingRate}%`} sx={sx} />
      <UIChip variant="outlined" label={`${clicks} ${messages.click}`} title={`${clickRate}%`} sx={sx} />
      <UIChip
        variant="outlined"
        label={`${unsubscribes} ${messages.unsubscribe}`}
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
