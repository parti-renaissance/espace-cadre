import { Typography } from '@mui/material'
import { fontWeight } from '~/theme/typography'
import { memo } from 'react'

function ProxyDoneIntroduction() {
  return (
    <div style={{ position: 'sticky', top: 80 }}>
      <p>
        <Typography fontWeight={fontWeight.medium} color={'text.secondary'}>
          Mandataires traités
        </Typography>
      </p>
    </div>
  )
}

export default memo(ProxyDoneIntroduction)
