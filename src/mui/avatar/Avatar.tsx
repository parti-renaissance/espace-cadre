import { grey } from '~/theme/palette'
import { pxToRem } from '~/theme/typography'
import { Avatar as MUIAvatar } from '@mui/material'

interface Props {
  initials?: string
  src?: string
}

export default function Avatar({ initials, src }: Props) {
  return (
    <MUIAvatar src={src} sx={{ bgcolor: grey[200], color: grey[600], fontSize: pxToRem(12), fontWeight: 'bold' }}>
      {initials}
    </MUIAvatar>
  )
}
