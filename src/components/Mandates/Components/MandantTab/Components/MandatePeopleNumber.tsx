import pluralize from '~/components/shared/pluralize/pluralize'
import { Paper, Typography } from '@mui/material'
import { grey, success } from '~/theme/palette'
import { MuiSpacing } from '~/theme/spacing'
import { fontWeight } from '~/theme/typography'
import { memo } from 'react'

interface Props {
  count: number
}

function MandatePeopleNumber({ count }: Props) {
  return (
    <Paper sx={{ backgroundColor: grey[200], borderWidth: 1, p: MuiSpacing.normal, textAlign: 'center' }}>
      <Typography color={success.main} fontSize={12} fontWeight={fontWeight.heavy}>
        <span data-testid="count">{count}</span> {pluralize(count, 'Mandataire')}
      </Typography>{' '}
      <Typography fontWeight={fontWeight.heavy} fontSize={12}>
        dans le même bureau de vote.
      </Typography>
    </Paper>
  )
}

export default memo(MandatePeopleNumber)
