import { Grid, Typography } from '@mui/material'
import { MuiSpacing } from '~/theme/spacing'
import { fontWeight } from '~/theme/typography'

interface Props {
  title: string
  value: string
}

export default function MandateCardEntry({ title, value }: Props) {
  return (
    <Grid container sx={{ mb: MuiSpacing.small }}>
      <Grid item xs={3}>
        <Typography fontWeight={fontWeight.medium} color={'text.secondary'} fontSize={12}>
          {title}
        </Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography fontSize={14}>{value}</Typography>
      </Grid>
    </Grid>
  )
}
