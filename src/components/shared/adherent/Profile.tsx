import { fullName, getInitials, guessHumanReadableTitleBasedOnGender } from '~/utils/names'
import Avatar from '~/mui/avatar/Avatar'
import { compact } from 'lodash'
import pluralize from '~/components/shared/pluralize/pluralize'
import { Stack, Typography } from '@mui/material'
import { Adherent } from '~/models/common.model'

const Profile = ({ adherent }: { adherent: Adherent }) => {
  const formattedText = compact([
    adherent.gender ? guessHumanReadableTitleBasedOnGender(adherent.gender) : null,
    adherent.age ? `${adherent.age} ${pluralize(adherent.age, 'an')}` : null,
    adherent.pid,
  ])

  const profile = { first_name: adherent.firstName, last_name: adherent.lastName.toUpperCase() }

  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="nowrap">
      <Avatar imageUrl={adherent.profileImage ?? undefined} initials={getInitials(profile)} />

      <Stack direction="column">
        <Typography variant="body2" fontWeight="medium" noWrap>
          {fullName(profile)}
        </Typography>

        {formattedText.length > 0 && (
          <Typography variant="body2" color="text.disabled" noWrap>
            {formattedText.join(', ')}
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}

export default Profile
