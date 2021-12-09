import { Chip } from '@mui/material'
import { styled } from '@mui/system'
import { Statistics } from 'domain/message'
import pluralize from 'components/shared/pluralize/pluralize'

const HorizontalContainer = styled('div')`
  display: flex;
  flex-wrap: wrap;
`

const messages = {
  update: 'Modifier',
  email: 'emails envoyé',
  open: 'lu',
  click: 'clic',
  unsubscribe: 'désabonnement',
}

const Body = ({ statistics }) => {
  const { sent, openings, openingRate, clicks, clickRate, unsubscribes, unsubscribeRate } = statistics
  const sx = { m: 0.5 }
  return (
    <HorizontalContainer>
      <Chip label={`${sent} ${pluralize(sent, messages.emails)}`} variant="outlined" sx={sx} />
      <Chip
        label={`${openings} ${pluralize(openings, messages.open)}`}
        title={`${openingRate}%`}
        variant="outlined"
        sx={sx}
      />
      <Chip
        label={`${clicks} ${pluralize(clicks, messages.click)}`}
        title={`${clickRate}%`}
        variant="outlined"
        sx={sx}
      />
      <Chip
        label={`${unsubscribes} ${pluralize(unsubscribes, messages.unsubscribe)}`}
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
