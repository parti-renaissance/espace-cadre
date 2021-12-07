import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { format } from 'date-fns'
import Chip from 'ui/Card/Chip/Chip'

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

const Horizontal = styled('div')`
  display: flex;
  flex-direction: row;
  flex: 1;
`

export const Header = ({ draft, createdAt }) => (
  <Horizontal>
    <Chip
      color={draft ? 'gray700' : 'green700'}
      backgroundColor={draft ? 'gray200' : 'green200'}
      label={draft ? messages.draft : messages.sent}
    />
    <UIDate>Le {format(createdAt, "dd/MM/yyyy 'à' HH:mm")}</UIDate>
  </Horizontal>
)

Header.propTypes = {
  draft: PropTypes.bool,
  createdAt: PropTypes.instanceOf(Date).isRequired,
}
