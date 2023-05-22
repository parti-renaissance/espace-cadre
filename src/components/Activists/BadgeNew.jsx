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
    {...(typeof renaissanceMembership[membership] !== 'undefined'
      ? {
          label: renaissanceMembership[membership],
          color:
            renaissanceMembership[membership] === renaissanceMembership.adherent_re ? 'colors.blue.500' : 'yellow800',
          bgcolor:
            renaissanceMembership[membership] === renaissanceMembership.adherent_re ? 'colors.blue.50' : 'pendingLabel',
        }
      : {
          label: 'Ni adhérent RE ni sympathisant RE',
          color: 'colors.gray.800',
          bgcolor: 'colors.gray.100',
        })}
    {...props}
  />
)

export default BadgeNew

MemberBadge.propTypes = {
  membership: PropTypes.string,
}
