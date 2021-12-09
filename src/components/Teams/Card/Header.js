import pluralize from 'components/shared/pluralize/pluralize'
import PropTypes from 'prop-types'
import { Chip } from 'ui/Card'
import { styled } from '@mui/system'

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
`

const messages = {
  member: 'membre',
}

const Header = ({ teamCount }) => (
  <HorizontalContainer>
    <Chip
      color="gray700"
      bgcolor="rgba(55, 65, 81, 0.08)"
      label={`${teamCount} ${pluralize(teamCount, messages.member)}`}
    />
  </HorizontalContainer>
)

Header.propTypes = {
  teamCount: PropTypes.number.isRequired,
}

export default Header
