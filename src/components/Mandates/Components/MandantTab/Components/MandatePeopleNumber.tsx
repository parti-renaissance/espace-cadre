import pluralize from '~/components/shared/pluralize/pluralize'
import { Paper, Typography } from '@mui/material'
import { grey } from '~/theme/palette'
import { MuiSpacing } from '~/theme/spacing'
import { fontWeight } from '~/theme/typography'
import { memo } from 'react'

interface Props {
  count: number
}

function MandatePeopleNumber({ count }: Props) {
  return (
    <Paper sx={{ backgroundColor: grey[200], borderWidth: 1, p: MuiSpacing.normal, textAlign: 'center' }}>
      <Typography color={'#5FCD5B'} fontSize={12}>
        {count} {pluralize(count, 'Mandataire')}
      </Typography>{' '}
      <Typography fontWeight={fontWeight.medium} fontSize={12}>
        dans le même bureau de vote.
      </Typography>
    </Paper>
  )
}

export default memo(MandatePeopleNumber)
