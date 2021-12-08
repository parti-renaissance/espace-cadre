import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { format } from 'date-fns'
import Chip from 'ui/Card/Chip/Chip'
import { Typography } from '@mui/material'

const UIDate = styled('span')(
  ({ theme }) => `
  color: ${theme.palette.gray600};
  padding: ${theme.spacing(1)};
`
)
const DateTypo = styled(Typography)`
  font-size: 10px;
`

const messages = {
  draft: 'Brouillon',
  sent: 'Envoyé',
}

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
`

export const Header = ({ draft, createdAt }) => (
  <HorizontalContainer>
    <Chip
      color={draft ? 'gray700' : 'green700'}
      backgroundColor={draft ? 'gray200' : 'green200'}
      label={draft ? messages.draft : messages.sent}
    />
    <UIDate>
      <DateTypo>Le {format(createdAt, "dd/MM/yyyy 'à' HH:mm")}</DateTypo>
    </UIDate>
  </HorizontalContainer>
)

Header.propTypes = {
  draft: PropTypes.bool,
  createdAt: PropTypes.instanceOf(Date).isRequired,
}
