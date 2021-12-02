import { Grid as MuiGrid } from '@mui/material'
import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { format } from 'date-fns'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'

const Grid = styled(MuiGrid)(
  ({ theme, container }) => `
  margin-bottom: ${container ? theme.spacing(1) : 0}
`
)

const Chip = styled(
  'span',
  shouldForwardProps
)(
  ({ theme, draft }) => `
  font-size: 10px;
  font-weight: 500;
  border-radius: 19px;
  padding: ${theme.spacing(0.25, 1)};
  color: ${draft ? theme.palette.red600 : theme.palette.teal700};
  background: ${draft ? theme.palette.inactiveLabel : theme.palette.activeLabel};
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
      <Chip draft={draft}>{draft ? messages.draft : messages.sent}</Chip>
    </Grid>
    <Grid item>
      <UIDate>Le {format(createdAt, 'dd/MM/yyyy')}</UIDate>
    </Grid>
  </Grid>
)

Header.propTypes = {
  draft: PropTypes.bool,
  createdAt: PropTypes.instanceOf(Date).isRequired,
}

export default Header
