import { Grid as MuiGrid, Chip } from '@mui/material'
import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { format } from 'date-fns'

const Grid = styled(MuiGrid)(
  ({ theme, container }) => `
  margin-bottom: ${container ? theme.spacing(1) : 0}
`
)

const UIDate = styled('span')(
  ({ theme }) => `
  font-size: 10px;
  color: ${theme.palette.gray600};
  padding: ${theme.spacing(1)};
`
)

const messages = {
  draft: 'Brouillon',
  sent: 'Envoyé',
}

const Header = ({ draft, createdAt }) => (
  <Grid container data-testid="news-header">
    <Grid item>
      <Chip
        variant="outlined"
        sx={{ color: draft ? 'gray700' : 'green700', bgcolor: draft ? 'gray200' : 'green200' }}
        size="small"
        label={draft ? messages.draft : messages.sent}
      />
    </Grid>
    <Grid item>
      <UIDate>Le {format(createdAt, "dd/MM/yyyy 'à' HH:mm")}</UIDate>
    </Grid>
  </Grid>
)

Header.propTypes = {
  draft: PropTypes.bool,
  createdAt: PropTypes.instanceOf(Date).isRequired,
}

export default Header
