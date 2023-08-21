import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { UIChip } from 'ui/Card'
import { Typography } from '@mui/material'
import { formatDate } from 'shared/helpers'

const UIDate = styled('span')(
  ({ theme }) => `
  color: ${theme.palette.gray600};
  display: flex;
  margin-left: ${theme.spacing(1)};
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
  align-items: center;
`

export const Header = ({ draft, createdAt }) => (
  <HorizontalContainer>
    <UIChip
      color={draft ? 'gray700' : 'green700'}
      bgcolor={draft ? 'gray200' : 'messagesBackground'}
      label={draft ? messages.draft : messages.sent}
    />
    <UIDate>
      <DateTypo>{formatDate(createdAt, "'Le' dd/MM/yyyy 'à' HH:mm")}</DateTypo>
    </UIDate>
  </HorizontalContainer>
)

Header.propTypes = {
  draft: PropTypes.bool,
  createdAt: PropTypes.instanceOf(Date).isRequired,
}
