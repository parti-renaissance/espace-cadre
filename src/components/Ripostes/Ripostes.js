import { useEffect, useState } from 'react'
import { Button as MuiButton, Container, Grid } from '@mui/material'
import { styled } from '@mui/system'
import MuiAddIcon from '@mui/icons-material/Add'
import RiposteModal from './RiposteModal'
import Riposte from 'domain/riposte'
import { getRipostes, updateRiposte } from 'api/ripostes'
import PageTitle from 'ui/PageTitle'
import UICard from 'ui/Card'
import Header from './Card/Header'
import Body from './Card/Body'

const messages = {
  title: 'Ripostes',
  create: 'Créer une riposte',
}

const Button = styled(MuiButton)(
  ({ theme }) => `
  background: ${theme.palette.riposteBackground};
  color: ${theme.palette.teal700};
  border-radius: 8.35px;
`
)

const AddIcon = styled(MuiAddIcon)(
  ({ theme }) => `
  margin-right: ${theme.spacing(1)}
`
)

const Ripostes = () => {
  const [ripostes, setRipostes] = useState([])
  const [newRiposte, setNewRiposte] = useState(null)
  const [open, setOpen] = useState(false)

  const handleClickOpen = id => {
    setNewRiposte(ripostes.find(riposte => riposte.id === id) || null)
    setOpen(true)
  }

  const toggleEnableRiposte = async id => {
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
            <AddIcon />
            {messages.create}
          </Button>
        </Grid>
        <Grid container spacing={2}>
          {ripostes.map(r => (
            <UICard key={r.id} header={<Header {...r} />} title={r.title} subtitle={`Par ${r.creator}`}>
              <Body riposte={r} handleClickOpen={handleClickOpen} toggleStatus={toggleEnableRiposte} />
            </UICard>
          ))}
        </Grid>
        <RiposteModal
          open={open}
          handleClose={handleClose}
          riposte={newRiposte}
          onSubmitRefresh={() => {
            getRipostes(setRipostes)
          }}
        />
      </Grid>
    </Container>
  )
}

export default Ripostes
