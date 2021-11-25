import { useEffect, useState } from 'react'
import { Button, Container, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import AddIcon from '@mui/icons-material/Add'
import RiposteModal from './RiposteModal'
import Riposte from 'domain/riposte'
import { getRipostes, updateRiposte } from 'api/ripostes'
import PageTitle from 'ui/PageTitle'
import UICard from 'ui/UICard'
import Header from './Card/Header'
import Body from './Card/Body'

const messages = {
  title: 'Ripostes',
  create: 'Créer une riposte',
}

const useStyles = makeStyles(theme => ({
  buttonContainer: {
    background: theme.palette.riposteBackground,
    borderRadius: '8.35px',
    marginBottom: theme.spacing(2),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  createButton: {
    color: theme.palette.teal700,
  },
}))

const Ripostes = () => {
  const classes = useStyles()
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
        <PageTitle title={messages.title} />
        <Grid item className={classes.buttonContainer}>
          <Button className={classes.createButton} onClick={handleNewRiposte}>
            <AddIcon className={classes.icon} />
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
