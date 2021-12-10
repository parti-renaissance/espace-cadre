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
import Header from './Card/Header'
import Content from './Card/Content'
import UICard, { Title } from 'ui/Card'
import Actions from 'components/Ripostes/Card/Actions'

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
        .sort((a, b) => +b.createdAt - +a.createdAt),
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
    <Container maxWidth="lg" sx={{ mb: 3 }}>
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
            <Grid item key={r.id} xs={12} sm={6} md={3}>
              <UICard
                rootProps={{ sx: { height: '238px' } }}
                headerProps={{ sx: { pt: '21px' } }}
                header={
                  <>
                    <Header {...r} />
                    <Title subject={r.title} author={`Par ${r.creator}`} sx={{ pt: 1 }} />
                  </>
                }
                contentProps={{ sx: { pt: 1 } }}
                content={<Content riposte={r} handleEdit={handleEdit(r.id)} toggleStatus={toggleRiposteStatus} />}
                actionsProps={{ sx: { pt: 3 } }}
                actions={
                  <Actions toggleStatus={() => toggleRiposteStatus(r.id)} onEdit={handleEdit(r.id)} status={r.status} />
                }
              />
            </Grid>
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
