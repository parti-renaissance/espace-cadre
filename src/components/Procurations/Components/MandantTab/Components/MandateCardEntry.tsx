import { Grid, Typography } from '@mui/material'
import { MuiSpacing } from '~/theme/spacing'
import { fontWeight } from '~/theme/typography'
import { ReactNode } from 'react'

interface Props {
  title: string
  value: string | ReactNode
}

export default function MandateCardEntry({ title, value }: Props) {
  return (
    <Grid container sx={{ mb: MuiSpacing.small }} spacing={MuiSpacing.normal}>
      <Grid item xs={4} sm={3} md={4} lg={4}>
        <Typography fontWeight={fontWeight.medium} color={'text.secondary'} fontSize={12}>
          {title}
        </Typography>
      </Grid>
      <Grid item xs={8} sm={9} md={8} lg={8}>
        {typeof value === 'string' ? <Typography fontSize={14}>{value}</Typography> : value}
      </Grid>
    </Grid>
  )
}
