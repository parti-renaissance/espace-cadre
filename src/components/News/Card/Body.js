import { Grid, Button as MuiButton } from '@mui/material'
import { styled } from '@mui/system'
import NewsStatus from './NewsStatus'
import PropTypes from 'prop-types'
import News from 'domain/news'

const Wrapper = styled(Grid)(
  () => `
  position: relative;
  bottom: 0;
  justify-content: space-between;
`
)

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

const messages = {
  see: 'Voir',
}

const Body = ({ news, handleClick, toggleStatus }) => {
  const { id, status } = news

  return (
    <>
      <Wrapper container>
        <Grid item>
          <Button onClick={handleClick}>{messages.see}</Button>
        </Grid>
        <Grid item>
          <NewsStatus id={id} status={status} toggleStatus={toggleStatus} />
        </Grid>
      </Wrapper>
    </>
  )
}

Body.propTypes = {
  news: News.propTypes.isRequired,
  handleClick: PropTypes.func.isRequired,
  toggleStatus: PropTypes.func.isRequired,
}

export default Body
