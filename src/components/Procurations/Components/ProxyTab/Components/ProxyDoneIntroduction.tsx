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
      <p>
        <Typography color={'text.secondary'} fontSize={14}>
          Ces mandataires ne peuvent plus être liés à un mandant.
        </Typography>
      </p>

      <p>
        <Typography color={'text.secondary'} fontSize={14}>
          En usant des filtres, vous pouvez dissocier les mandataires liés à un ou plusieurs mandants de ceux que vous
          avez exclu.
        </Typography>
      </p>

      <p>
        <Typography color={'text.secondary'} fontSize={14}>
          Vous pouvez également voir les associations précédemment faites et les annuler si nécessaire.
        </Typography>
      </p>
    </div>
  )
}

export default memo(ProxyDoneIntroduction)
