import PropTypes from 'prop-types'
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

const EmptyContent = ({ title, description, action }) => (
  <Container>
    <UpcomingRoundedIcon sx={{ fontSize: '67px', color: 'main' }} />
    {title && <Title sx={{ pt: 2, color: 'main' }}>{title}</Title>}
    {description && <Description sx={{ py: 2, color: 'emptyContent.description' }}>{description}</Description>}
    {action}
  </Container>
)

EmptyContent.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
}

export default EmptyContent
