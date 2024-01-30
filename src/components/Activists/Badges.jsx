import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import { UIChip } from '~/ui/Card'

const renaissanceMembership = {
  adherent_re: 'Adhérent',
  sympathizer_re: 'Sympathisant',
}

const tagAliases = {
  new_adherent: 'Nouveau ✨',
  recontributor: 'Recotisant',
  new_sympathizer: 'Nouveau ✨',
  old_adherent_em: 'Ancien adhérent EM',
  donator_n: 'Donateur Année N',
  'donator_n-x': 'Donateur Années N-1',
}

const Badges = ({ tags }) => {
  const tagsGroups = tags
    .filter(tag => !!tagAliases[tag])
    .map((tag, idx) => (
      <UIChip
        key={idx}
        label={tagAliases[tag]}
        color="#0369a1"
        bgcolor="#f0f9ff"
        labelStyle={{ fontSize: '12px', fontWeight: '600' }}
        sx={{ display: 'flex', width: 'fit-content', my: 0.5 }}
      />
    ))

  return (
    <Box display="flex" alignItems="center" flexWrap="wrap" className="space-x-2">
      {tagsGroups}
    </Box>
  )
}

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

export default Badges

Badges.propTypes = {
  tags: PropTypes.array.isRequired,
}

MemberBadge.propTypes = {
  membership: PropTypes.string,
}
