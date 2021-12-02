import { useCallback, useState } from 'react'
import { Button as MuiButton, Container, Grid } from '@mui/material'
import { styled } from '@mui/system'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import AddIcon from '@mui/icons-material/Add'
import CreateEditModal from './CreateEditModal'
import Riposte from 'domain/riposte'
import { getRipostesQuery, updateRiposteStatusQuery } from 'api/ripostes'
import { useErrorHandler } from 'components/shared/error/hooks'
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
  const [editingRiposte, setEditingRiposte] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()
  const { handleError } = useErrorHandler()

  const { data: ripostes = [], refetch } = useQuery('ripostes', () => getRipostesQuery(), { onError: handleError })
  const { mutate: updateRiposteStatus } = useMutation(updateRiposteStatusQuery, {
    onSuccess: () => {
      refetch()
    },
    onError: handleError,
  })

  const handleRiposteCreate = () => {
    setEditingRiposte(Riposte.NULL)
    setIsModalOpen(true)
  }

  const handleEdit = id => () => {
    setEditingRiposte(ripostes.find(riposte => riposte.id === id) || Riposte.NULL)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
  }

  const mergeToggledRiposte = useCallback(
    (id, toggledRiposte) => prevRipostes =>
      prevRipostes
        .filter(r => r.id !== id)
        .concat(toggledRiposte)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    []
  )

  const toggleRiposteStatus = useCallback(
    id => {
      const riposte = ripostes.find(r => r.id === id)
      const toggledRiposte = riposte.toggleStatus()
      // TODO: replace this trick by using a loader inside RiposteStatus
      queryClient.setQueryData('ripostes', mergeToggledRiposte(id, toggledRiposte))
      updateRiposteStatus(toggledRiposte)
    },
    [ripostes, mergeToggledRiposte, updateRiposteStatus, queryClient]
  )

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="space-between">
        <Grid item>
          <PageTitle title={messages.title} />
        </Grid>
        <Grid item>
          <Button onClick={handleRiposteCreate}>
            <AddIcon sx={{ mr: 1 }} />
            {messages.create}
          </Button>
        </Grid>
        <Grid container spacing={2}>
          {ripostes.map(r => (
            <Card key={r.id} header={<Header {...r} />} title={r.title} subtitle={`Par ${r.creator}`}>
              <Content riposte={r} handleEdit={handleEdit(r.id)} toggleStatus={toggleRiposteStatus} />
            </Card>
          ))}
        </Grid>
        <CreateEditModal
          open={isModalOpen}
          riposte={editingRiposte}
          onCloseResolve={handleClose}
          onSubmitResolve={refetch}
        />
      </Grid>
    </Container>
  )
}

export default Ripostes
