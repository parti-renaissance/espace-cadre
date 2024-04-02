import { Typography } from '@mui/material'
import { fontWeight } from '~/theme/typography'
import { memo } from 'react'

function MandateDoneIntroduction() {
  return (
    <div style={{ position: 'sticky', top: 80 }}>
      <p>
        <Typography fontWeight={fontWeight.medium} color={'text.secondary'}>
          Mandants traités
        </Typography>
      </p>
    </div>
  )
}

export default memo(MandateDoneIntroduction)
