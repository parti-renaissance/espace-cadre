import { UIChip } from '~/ui/Card'
import PropTypes from 'prop-types'

const Badge = ({ badge }) => {
  const { sx = {}, ...badgeOptions } = badge.badgeOptions ?? {}

  return (
    <UIChip
      label={badge.label}
      help={badge.help}
      color="#0369a1"
      bgcolor="#f0f9ff"
      labelStyle={{ fontSize: '12px', fontWeight: '600' }}
      sx={{ display: 'flex', width: 'fit-content', py: 1, my: 0.5, ...sx }}
      {...badgeOptions}
    />
  )
}

export default Badge

Badge.propTypes = {
  badge: PropTypes.shape({
    label: PropTypes.string.isRequired,
    help: PropTypes.string,
    badgeOptions: PropTypes.object,
  }).isRequired,
}
