import { useCallback, useState } from 'react'
import { Container, Grid } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import CreateEditModal from './CreateEditModal'
import Riposte from 'domain/riposte'
import { createRiposteQuery, getRipostesQuery, updateRiposteQuery, updateRiposteStatusQuery } from 'api/ripostes'
import { useErrorHandler } from 'components/shared/error/hooks'
import Header from './Card/Header'
import Content from './Card/Content'
import UICard, { Title } from 'ui/Card'
import Actions from 'components/Ripostes/Card/Actions'
import { getNextPageParam, refetchUpdatedPage, usePaginatedData } from 'api/pagination'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import Loader from 'ui/Loader'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import PageHeader from 'ui/PageHeader'
import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'

const messages = {
  title: 'Actions numériques',
  create: 'Créer une action numérique',
  toggleSuccess: "L'action numérique a bien été modifiée",
  createSuccess: 'Action numérique créée avec succès',
  editSuccess: "L'action numérique a bien été modifiée",
  noRiposte: 'Aucune action numérique à afficher',
}

const Ripostes = () => {
  const [editingRiposte, setEditingRiposte] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError, errorMessages, resetErrorMessages } = useErrorHandler()

  const {
    data: paginatedRipostes = null,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading: isRipostesLoading,
  } = useInfiniteQueryWithScope(['paginated-ripostes', { feature: 'Ripostes', view: 'Ripostes' }], getRipostesQuery, {
    getNextPageParam,
    onError: handleError,
  })

  const ripostes = usePaginatedData(paginatedRipostes)

  const { mutateAsync: updateRiposteStatus, isLoading: isToggleStatusLoading } = useMutation(updateRiposteStatusQuery, {
    onSuccess: async (_, updatedRiposte) => {
      await refetchUpdatedPage(paginatedRipostes, refetch, updatedRiposte.id)
      enqueueSnackbar(messages.toggleSuccess, notifyVariants.success)
    },
    onError: handleError,
  })

  const { mutateAsync: createRiposte, isLoading: isCreateLoading } = useMutation(createRiposteQuery, {
    onSuccess: async () => {
      await refetch()
      enqueueSnackbar(messages.createSuccess, notifyVariants.success)
    },
    onError: handleError,
  })

  const { mutateAsync: updateRiposte, isLoading: isUpdateLoading } = useMutation(updateRiposteQuery, {
    onSuccess: async (_, updatedRiposte) => {
      await refetchUpdatedPage(paginatedRipostes, refetch, updatedRiposte.id)
      enqueueSnackbar(messages.editSuccess, notifyVariants.success)
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
    resetErrorMessages()
  }

  const toggleRiposteStatus = useCallback(
    async id => {
      const riposte = ripostes.find(r => r.id === id)
      const toggledRiposte = riposte.toggleStatus()
      await updateRiposteStatus(toggledRiposte)
    },
    [ripostes, updateRiposteStatus]
  )

  return (
    <Container maxWidth={false} sx={{ mb: 2 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={<PageHeaderButton onClick={handleRiposteCreate} label={messages.create} isMainButton />}
        />
      </Grid>
      {!isRipostesLoading && !ripostes.length && <Grid>{messages.noRiposte}</Grid>}
      {isRipostesLoading ? (
        <Loader />
      ) : (
        <InfiniteScroll
          dataLength={ripostes.length}
          next={() => fetchNextPage()}
          hasMore={hasNextPage}
          loader={<Loader />}
        >
          <Grid container spacing={2}>
            {ripostes.map(r => (
              <Grid item key={r.id} xs={12} sm={6} md={3}>
                <UICard
                  rootProps={{ sx: { minHeight: '238px' } }}
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
                    <Actions
                      toggleStatus={() => toggleRiposteStatus(r.id)}
                      onEdit={handleEdit(r.id)}
                      status={r.status}
                      loader={isToggleStatusLoading}
                    />
                  }
                />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}
      {isModalOpen && (
        <CreateEditModal
          open
          riposte={editingRiposte}
          onCloseResolve={handleClose}
          createRiposte={createRiposte}
          updateRiposte={updateRiposte}
          loader={isCreateLoading || isUpdateLoading}
          errors={errorMessages}
        />
      )}
    </Container>
  )
}

export default Ripostes
