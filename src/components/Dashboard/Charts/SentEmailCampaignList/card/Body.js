import { Chip } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import Message, { Statistics } from 'domain/message'
import CtaButton from 'ui/Card/CtaButton/CtaButton'

const Horizontal = styled('div')`
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

const SentBody = ({ statistics }) => {
  const { sent, openings, openingRate, clicks, clickRate, unsubscribes, unsubscribeRate } = statistics
  const sx = { m: 0.5 }
  return (
    <Horizontal>
      <Chip label={`${sent} ${messages.emails}`} variant="outlined" sx={sx} />
      <Chip label={`${openings} ${messages.open}`} title={`${openingRate}%`} variant="outlined" sx={sx} />
      <Chip label={`${clicks} ${messages.click}`} title={`${clickRate}%`} variant="outlined" sx={sx} />
      <Chip
        label={`${unsubscribes} ${messages.unsubscribe}`}
        title={`${unsubscribeRate}%`}
        variant="outlined"
        sx={sx}
      />
    </Horizontal>
  )
}

SentBody.propTypes = {
  statistics: Statistics.propTypes.isRequired,
}

const Body = ({ message, handleClick }) => {
  if (!message.draft) {
    return <SentBody statistics={message.statistics} />
  }

  return (
    <CtaButton
      onClick={handleClick}
      sx={{
        color: 'yellow400',
        '&:hover': {
          backgroundColor: '#FFFAEE',
        },
      }}
    >
      {messages.update}
    </CtaButton>

    /*<Grid container>
      <CardRow>
        <Button onClick={handleClick}>{messages.update}</Button>
      </CardRow>
    </Grid>*/
  )
}

Body.propTypes = {
  message: Message.propTypes.isRequired,
  handleClick: PropTypes.func.isRequired,
}

export default Body
