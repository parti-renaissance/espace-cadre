import { Grid, Button as MuiButton } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import { Statistics } from 'domain/message'
import Stat from './Stat'

const Button = styled(MuiButton)(
  ({ theme }) => `
  font-size: 13px;
  font-weight: 500;
  color: ${theme.palette.orange500};
  margin-top: ${theme.spacing(1.5)};
  &:hover {
    background: ${theme.palette.newsBackground};
    border-radius: 8.35px;
  };
`
)

const CardRow = styled(props => <Grid {...props} container />)(
  ({ theme }) => `
   padding: ${theme.spacing(0, 2)};
`
)

const CardItem = styled('div')(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: ${theme.spacing(1, 1, 1, 0)};
  border-radius: 6px;
  border: solid 1px ${theme.palette.grayCornerBg};
  &:not(:last-child): {
    margin-right: ${theme.spacing(1)};
  }
`
)
const Horizontal = styled('div')`
  display: flex;
  flex: 1;
`

const messages = {
  see: 'Voir',
  email: 'Email',
  opening: 'Ouverture',
  click: 'Clic',
  unsubscribe: 'Désabonnement',
}

const Body = ({ statistics, handleClick }) => {
  const { sent, openings, openingRate, clicks, clickRate, unsubscribes, unsubscribeRate } = statistics
  return (
    <Grid container>
      <CardRow>
        <Horizontal>
          <CardItem>
            <Stat number={sent} label={messages.email} wrapNumber={false} />
          </CardItem>
          <CardItem>
            <Stat label={messages.opening} number={openings} rate={openingRate} />
          </CardItem>
        </Horizontal>
        <Horizontal>
          <CardItem>
            <Stat label={messages.click} number={clicks} rate={clickRate} />
          </CardItem>
          <CardItem>
            <Stat label={messages.unsubscribe} number={unsubscribes} rate={unsubscribeRate} />
          </CardItem>
        </Horizontal>
      </CardRow>
      <CardRow>
        <Button onClick={handleClick}>{messages.see}</Button>
      </CardRow>
    </Grid>
  )
}

Body.propTypes = {
  statistics: Statistics.propTypes.isRequired,
  handleClick: PropTypes.func.isRequired,
}

export default Body
