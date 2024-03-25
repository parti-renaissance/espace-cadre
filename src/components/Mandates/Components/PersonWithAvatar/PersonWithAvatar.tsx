import Avatar from '~/mui/avatar/Avatar'
import { getInitials } from '~/utils/names'
import { Grid, Typography } from '@mui/material'
import { MuiSpacing } from '~/theme/spacing'
import { fontWeight } from '~/theme/typography'

interface Props {
  src?: string
  firstName: string
  lastName: string
  id: string
}

export default function PersonWithAvatar({ src, firstName, lastName, id }: Props) {
  return (
    <Grid container sx={{ alignItems: 'center' }} spacing={MuiSpacing.normal}>
      <Grid item>
        <Avatar src={src} initials={getInitials({ first_name: firstName, last_name: lastName })} />
      </Grid>
      <Grid item>
        <div>
          <Typography fontWeight={fontWeight.medium} fontSize={14}>
            {firstName} {lastName}
          </Typography>
        </div>
        <div>
          <Typography color="text.disabled" fontSize={14}>
            #{id}
          </Typography>
        </div>
      </Grid>
    </Grid>
  )
}
