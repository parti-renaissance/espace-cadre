import { Grid, Button as MuiButton } from '@mui/material'
import { styled } from '@mui/system'
import NewsEnableStatus from './NewsEnableStatus'
import PropTypes from 'prop-types'
import News from 'domain/news'

const BodyContainer = styled(Grid)(
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

const Body = ({ news, handleClickOpen, toggleStatus }) => {
  const { id, status } = news

  return (
    <>
      <BodyContainer container>
        <Grid item>
          <Button onClick={() => handleClickOpen(id)}>{messages.see}</Button>
        </Grid>
        <Grid item>
          <NewsEnableStatus id={id} status={status} toggleStatus={toggleStatus} />
        </Grid>
      </BodyContainer>
    </>
  )
}

Body.propTypes = {
  news: News.propTypes.isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  toggleStatus: PropTypes.func.isRequired,
}

export default Body
