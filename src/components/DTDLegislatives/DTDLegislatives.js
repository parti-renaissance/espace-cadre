import { useState } from 'react'
import { Container, Grid } from '@mui/material'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Modal from './Modal'

const messages = {
  title: 'Porte à porte législatives',
  create: 'Créer une campagne',
}

const DTDLegislatives = () => {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={<PageHeaderButton label={messages.create} onClick={() => setOpen(true)} isMainButton />}
        />
      </Grid>
      {open && <Modal open={open} handleClose={handleClose} />}
    </Container>
  )
}

export default DTDLegislatives
