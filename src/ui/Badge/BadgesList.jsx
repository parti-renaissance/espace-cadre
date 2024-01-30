import Badge from '~/ui/Badge/Badge'
import PropTypes from 'prop-types'

const BadgesList = ({ badges }) => badges.map((badge, index) => <Badge key={`${badge.label}-${index}`} badge={badge} />)

export default BadgesList

BadgesList.propTypes = {
  badges: PropTypes.array,
}
