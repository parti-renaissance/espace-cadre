import { PropsWithChildren } from 'react'
import { MuiSpacing } from '~/theme/spacing'
import { Container, Grid } from '@mui/material'
import PageHeader from '~/ui/PageHeader'
import BackButton from '~/components/BackButton/BackButton'

export type PageProps<T> = PropsWithChildren<T> & { title?: string; backButton?: boolean }

export default function Page<T>({ children, title, backButton = false }: PageProps<T>) {
  return (
    <Container sx={{ mb: MuiSpacing.normal }}>
      {backButton && <BackButton />}

      <Grid container justifyContent="space-between">
        {title && <PageHeader title={title} />}
      </Grid>

      {children}
    </Container>
  )
}
