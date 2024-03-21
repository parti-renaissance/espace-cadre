import { gridStandardLayout, MuiSpacing, withBottomSpacing } from '~/theme/spacing'
import { Grid, Typography } from '@mui/material'
import { memo, useState } from 'react'
import generateFixedArray from '~/utils/generateFixedArray'
import MandatePersonCard from '~/components/Mandates/Components/MandantTab/Components/MandatePersonCard'
import { random } from 'lodash'
import { fontWeight } from '~/theme/typography'
import { formatToFrenchNumberString } from '~/utils/numbers'

export default function MandantTab() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  return (
    <Grid container {...withBottomSpacing} spacing={MuiSpacing.large}>
      <Grid item {...gridStandardLayout.oneThird}>
        <MandateIntroductionMemo />
      </Grid>

      <Grid item {...gridStandardLayout.twoThirds}>
        <Grid item sx={{ mb: MuiSpacing.large }}>
          <p>
            <Typography fontWeight={fontWeight.medium}>{formatToFrenchNumberString(123456)} Mandants</Typography>
          </p>
        </Grid>

        {generateFixedArray(5).map((_, idx) => (
          <MandatePersonCardMemo
            key={idx}
            firstName={'Agent'}
            lastName={'47'}
            avatarUrl={'https://fr.web.img4.acsta.net/newsv7/17/11/14/10/31/4561672.jpg'}
            votePlace={'Paris'}
            location={'Inconnue'}
            peopleInSameVotePlace={random(0, 10)}
            tags={['Mandataire']}
            id={'00047'}
            expanded={Boolean(expanded['00047'])}
            extraInfos={[
              {
                key: 'Lorem',
                value: 'Ipsum',
              },
              {
                key: 'Lorem',
                value: 'Ipsum',
              },
              {
                key: 'Lorem',
                value: 'Ipsum',
              },
            ]}
            onExpend={id =>
              setExpanded(v => ({
                ...v,
                [id]: true,
              }))
            }
            onNarrow={id =>
              setExpanded(v => ({
                ...v,
                [id]: false,
              }))
            }
          />
        ))}
      </Grid>
    </Grid>
  )
}

const MandateIntroduction = () => (
  <>
    <p>
      <Typography fontWeight={fontWeight.medium} color={'text.secondary'}>
        Mandants à traiter
      </Typography>{' '}
      <br />
      <Typography color={'text.secondary'} fontSize={14}>
        Pour chacun de ces mandant, vous pouvez voir le nombre de mandataires disponibles dans le même bureau de vote et
        cliquer sur « Trouver un mandataire » pour voir la liste des mandataires disponibles du plus proche au plus
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
  </>
)

const MandateIntroductionMemo = memo(MandateIntroduction)
const MandatePersonCardMemo = memo(MandatePersonCard)
