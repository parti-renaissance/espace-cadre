import pluralize from '~/components/shared/pluralize/pluralize'
import { Paper, Typography } from '@mui/material'
import { grey } from '~/theme/palette'
import { MuiSpacing } from '~/theme/spacing'
import { fontWeight } from '~/theme/typography'

interface Props {
  count: number
}

export default function MandatePeopleNumber({ count }: Props) {
  const plural = pluralize(count, 'mandataire')

  return (
    <Paper sx={{ backgroundColor: grey[200], borderWidth: 1, p: MuiSpacing.normal, textAlign: 'center' }}>
      <Typography fontWeight={fontWeight.medium} fontSize={12}>
        Nombre de {plural} dans le même bureau de vote :
      </Typography>{' '}
      <Typography color={'#5FCD5B'} fontSize={12}>
        {count} {plural}
      </Typography>
    </Paper>
  )
}
