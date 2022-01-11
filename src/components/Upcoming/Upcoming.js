import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

import UpcomingRoundedIcon from '@mui/icons-material/UpcomingRounded'

const Container = styled(props => (
  <Grid container justifyContent="center" alignItems="center" direction="column" {...props} />
))(({ theme }) => `height: calc(100vh - ${theme.spacing(6)});`)

const Title = styled(Typography)`
  font-size: 24px;
  font-weight: 400;
  line-height: 36px;
`

const Description = styled(Typography)`
  font-size: 18px;
  font-weight: 400;
  line-height: 27px;
`

const messages = {
  title: 'Bientôt en ligne',
  description: 'Cette page sera bientôt disponible sur notre site !',
}

const Upcoming = () => (
  <Container>
    <UpcomingRoundedIcon sx={{ fontSize: '67px', color: 'upcoming.icon' }} />
    <Title sx={{ pt: 2, color: 'upcoming.title' }}>{messages.title}</Title>
    <Description sx={{ pt: 2, color: 'upcoming.description' }}>{messages.description}</Description>
  </Container>
)

export default Upcoming
