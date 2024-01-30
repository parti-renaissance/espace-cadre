import { Grid, Card as MuiCard, Typography } from '@mui/material'
import { styled } from '@mui/system'
import ClearIcon from '@mui/icons-material/Clear'
import PropTypes from 'prop-types'
import { GroupMember } from '~/domain/group'
import { parseDate } from '~/shared/helpers'

const Card = styled(MuiCard)`
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: 8px;
  box-shadow: none;
`

const Title = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.gray900};
`

const messages = {
  adherent: ', militant(e) depuis le ',
}

const MemberCard = ({ member, handleDelete }) => {
  const { id, firstname, lastname, postalCode, registeredAt } = member

  return (
    <Grid item key={id} xs={12} sm={6} md={3}>
      <Card>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Title>
              {firstname} {lastname}
            </Title>
          </Grid>
          <Grid item>
            <ClearIcon onClick={handleDelete} sx={{ cursor: 'pointer' }} />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="subtitle2">
              {postalCode}
              {messages.adherent}
              {parseDate(registeredAt).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  )
}

export default MemberCard

MemberCard.defaultProps = {
  handleDelete: () => {},
}

MemberCard.propTypes = {
  member: GroupMember.propTypes.isRequired,
  handleDelete: PropTypes.func,
}
