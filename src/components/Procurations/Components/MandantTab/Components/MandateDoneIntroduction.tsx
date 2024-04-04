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
        <br />
        <Typography color={'text.secondary'} fontSize={14}>
          Retrouvez dans cet onglet l’ensemble des mandants déjà traités.
        </Typography>
      </p>

      <p>
        <Typography color={'text.secondary'} fontSize={14}>
          En usant des filtres, vous pouvez dissocier les mandants liés à un mandataire de ceux que vous avez exclu ou
          traité manuellement.
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

export default memo(MandateDoneIntroduction)
