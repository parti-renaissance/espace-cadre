import { PropsWithChildren } from 'react'
import { MuiSpacing } from '~/theme/spacing'
import { Container, Grid } from '@mui/material'
import PageHeader from '~/ui/PageHeader'

export default function Page<T>({ children, title }: PropsWithChildren<T> & { title: string }) {
  return (
    <Container sx={{ mb: MuiSpacing.normal }}>
      <Grid container justifyContent="space-between">
        <PageHeader title={title} />
      </Grid>

      {children}
    </Container>
  )
}
