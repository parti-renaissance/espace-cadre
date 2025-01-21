import { grey } from '~/theme/palette'
import { pxToRem } from '~/theme/typography'
import { Avatar as MUIAvatar } from '@mui/material'

interface Props {
  initials?: string
  imageUrl?: string | null
}

export default function Avatar({ initials, imageUrl }: Props) {
  return (
    <MUIAvatar
      sx={{ bgcolor: grey[200], color: grey[600], fontSize: pxToRem(12), fontWeight: 'bold' }}
      src={imageUrl || undefined}
    >
      {initials}
    </MUIAvatar>
  )
}
