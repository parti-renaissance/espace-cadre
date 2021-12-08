import pluralize from 'components/shared/pluralize/pluralize'
import PropTypes from 'prop-types'
import { Chip } from 'ui/Card'

const messages = {
  member: 'membre',
}

const Header = ({ teamCount }) => (
  <Chip
    color="gray700"
    backgroundColor="rgba(55, 65, 81, 0.08)"
    label={`${teamCount} ${pluralize(teamCount, messages.member)}`}
  />
)

Header.propTypes = {
  teamCount: PropTypes.number.isRequired,
}

export default Header
