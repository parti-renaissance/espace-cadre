import { Chip } from '@mui/material'
import { styled } from '@mui/system'
import { Statistics } from 'domain/message'

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
  const sx = { m: 0.5 }
  return (
    <HorizontalContainer>
      <Chip label={`${sent} ${messages.emails}`} variant="outlined" sx={sx} />
      <Chip label={`${openings} ${messages.open}`} title={`${openingRate}%`} variant="outlined" sx={sx} />
      <Chip label={`${clicks} ${messages.click}`} title={`${clickRate}%`} variant="outlined" sx={sx} />
      <Chip
        label={`${unsubscribes} ${messages.unsubscribe}`}
        title={`${unsubscribeRate}%`}
        variant="outlined"
        sx={sx}
      />
    </HorizontalContainer>
  )
}

Body.propTypes = {
  statistics: Statistics.propTypes.isRequired,
}

export default Body
