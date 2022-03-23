import { Grid, Container, Dialog, Button as MUIButon, Slide } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { ArrowBack as ArrowBackIcon, Close as CloseIcon } from '@mui/icons-material/'

import Button from 'ui/Button'
import Register from './Register'
import Map from './Map'
import './styles.css'
import { useState, forwardRef } from 'react'
import PollingStationSelect from './PollingStationSelect'
import { Title } from './styles'

const VIEW_MODE_REGISTER = 'register'
const VIEW_MODE_SELECT = 'select'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const messages = {
  title: 'Nouvelle campagne de porte à porte',
  nextButton: 'suivant',
  backButton: 'retour',
  submitButton: 'créer la campagne',
}

function App() {
  const [open, setOpen] = useState(true)
  const [viewMode, setViewMode] = useState(VIEW_MODE_REGISTER)
  const shouldDisplayRegister = viewMode === VIEW_MODE_REGISTER

  const handleClose = () => {
    setOpen(false)
    window.open('/porte-a-porte', '_blank')
  }

  const onRegisterSubmit = () => {
    if (shouldDisplayRegister) {
      setViewMode(VIEW_MODE_SELECT)
    } else {
      // ================Campagne crée!!====================
      handleClose()
    }
  }

  const onBackClickHandler = () => {
    setViewMode(VIEW_MODE_REGISTER)
  }

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <Container maxWidth="xl">
        <Grid container sx={{ py: 4, pl: 2 }}>
          <Grid item xs={9}>
            {!shouldDisplayRegister && (
              <MUIButon
                startIcon={<ArrowBackIcon />}
                onClick={onBackClickHandler}
                size="large"
                sx={{ color: 'main', mr: 4 }}
              >
                Retour
              </MUIButon>
            )}
            <Title>{messages.title}</Title>
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              onClick={onRegisterSubmit}
              rootProps={{ sx: { color: 'whiteCorner', marginRight: 4 } }}
              disabled={false}
            >
              {shouldDisplayRegister ? messages.nextButton : messages.submitButton}
            </Button>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid container sx={{ borderRadius: '12px', background: '#ffffff' }} className="main">
          <Grid item xs={6} sx={{ px: 4 }}>
            {shouldDisplayRegister && <Register />}
            {!shouldDisplayRegister && <PollingStationSelect />}
          </Grid>
          <Grid item xs={6}>
            <Map />
          </Grid>
        </Grid>
      </Container>
    </Dialog>
  )
}

export default App
