import PropTypes from 'prop-types'
import { UIChip } from 'ui/Card'

const renaissanceMembership = {
  adherent_re: 'Adhérent',
  sympathizer_re: 'Sympathisant',
}

const BadgeNew = () => (
  <UIChip
    label="Nouveau ✨"
    color="#0369a1"
    bgcolor="#f0f9ff"
    labelStyle={{ fontSize: '14px', fontWeight: '600' }}
    sx={{ display: 'flex', width: 'fit-content' }}
  />
)

export const MemberBadge = ({ membership, ...props }) => (
  <UIChip
    label={typeof renaissanceMembership[membership] !== 'undefined' ? renaissanceMembership[membership] : 'N/A'}
    color={typeof renaissanceMembership[membership] !== 'undefined' ? 'colors.blue.500' : 'colors.gray.800'}
    bgcolor={typeof renaissanceMembership[membership] !== 'undefined' ? 'colors.blue.50' : 'colors.gray.100'}
    {...props}
  />
)

export default BadgeNew

MemberBadge.propTypes = {
  membership: PropTypes.string,
}
