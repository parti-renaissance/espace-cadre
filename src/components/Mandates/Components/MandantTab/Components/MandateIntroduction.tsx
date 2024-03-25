import { Typography } from '@mui/material'
import { fontWeight } from '~/theme/typography'
import { memo } from 'react'

function MandateIntroduction() {
  return (
    <div style={{ position: 'sticky', top: 80 }}>
      <p>
        <Typography fontWeight={fontWeight.medium} color={'text.secondary'}>
          Mandants à traiter
        </Typography>
        <br />
        <Typography color={'text.secondary'} fontSize={14}>
          Pour chacun de ces mandant, vous pouvez voir le nombre de mandataires disponibles dans le même bureau de vote
          et cliquer sur « Trouver un mandataire » pour voir la liste des mandataires disponibles du plus proche au plus
          éloigné.
        </Typography>
      </p>

      <p>
        <Typography color={'text.secondary'} fontSize={14}>
          Veillez à utiliser toutes les informations affichées pour faire les meilleurs choix possible.
        </Typography>
      </p>

      <p>
        <Typography color={'text.secondary'} fontSize={14}>
          Au besoin vous pouvez écarter les mandants qui n’ont plus besoin d’être traités en cliquant sur « Traiter
          manuellement » ou ceux qui vous semblent louche en cliquant sur « Exclure ».
        </Typography>
      </p>
    </div>
  )
}

export default memo(MandateIntroduction)
