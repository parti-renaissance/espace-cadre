import { Typography } from '@mui/material'
import { fontWeight } from '~/theme/typography'
import { memo } from 'react'

function ProxyIntroduction() {
  return (
    <div style={{ position: 'sticky', top: 80 }}>
      <p>
        <Typography fontWeight={fontWeight.medium} color={'text.secondary'}>
          Mandataires disponibles
        </Typography>
      </p>
    </div>
  )
}

export default memo(ProxyIntroduction)
