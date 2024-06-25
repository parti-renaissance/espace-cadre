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
      <p>
        <Typography color={'text.secondary'} fontSize={14}>
          Ces mandataires peuvent encore porter au moins une procuration.
        </Typography>
      </p>

      <p>
        <Typography color={'text.secondary'} fontSize={14}>
          Vous pouvez écarter les profils douteux en cliquant sur « Exclure ». Ils ne s’afficheront plus dans les
          possibilités de liaison.
        </Typography>
      </p>
    </div>
  )
}

export default memo(ProxyIntroduction)
