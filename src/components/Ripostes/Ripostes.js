import { useEffect, useState } from 'react'
import { Button as MuiButton, Container, Grid } from '@mui/material'
import { styled } from '@mui/system'
import AddIcon from '@mui/icons-material/Add'
import CreateEditModal from './CreateEditModal'
import Riposte from 'domain/riposte'
import { getRipostes, updateRiposte } from 'api/ripostes'
import PageTitle from 'ui/PageTitle'
import Card from 'ui/Card'
import Header from './Card/Header'
import Content from './Card/Content'

const Button = styled(MuiButton)(
  ({ theme }) => `
  background: ${theme.palette.riposteBackground};
  color: ${theme.palette.teal700};
  border-radius: 8.35px;
  `
)

const messages = {
  title: 'Ripostes',
  create: 'Créer une riposte',
}

const Ripostes = () => {
  const [ripostes, setRipostes] = useState([])
  const [newRiposte, setNewRiposte] = useState(null)
  const [open, setOpen] = useState(false)

  const handleClickOpen = id => {
    setNewRiposte(ripostes.find(riposte => riposte.id === id) || null)
    setOpen(true)
  }

  const toggleRiposteStatus = async id => {
    const riposte = ripostes.find(r => r.id === id)
    const newRiposte = riposte.toggleStatus()
    setRipostes(prev =>
      prev
        .filter(r => r.id !== id)
        .concat(newRiposte)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    )
    await updateRiposte(newRiposte)
    getRipostes(setRipostes)
  }

  const handleNewRiposte = () => {
    setNewRiposte(Riposte.NULL)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmitRefresh = () => {
    getRipostes(setRipostes)
  }

  useEffect(() => {
    getRipostes(setRipostes)
  }, [])

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="space-between">
        <Grid item>
          <PageTitle title={messages.title} />
        </Grid>
        <Grid item>
          <Button onClick={handleNewRiposte}>
            <AddIcon sx={{ mr: 1 }} />
            {messages.create}
          </Button>
        </Grid>
        <Grid container spacing={2}>
          {ripostes.map(r => (
            <Card key={r.id} header={<Header {...r} />} title={r.title} subtitle={`Par ${r.creator}`}>
              <Content riposte={r} handleClickOpen={handleClickOpen} toggleStatus={toggleRiposteStatus} />
            </Card>
          ))}
        </Grid>
        <CreateEditModal
          open={open}
          handleClose={handleClose}
          riposte={newRiposte}
          onSubmitRefresh={handleSubmitRefresh}
        />
      </Grid>
    </Container>
  )
}

export default Ripostes
