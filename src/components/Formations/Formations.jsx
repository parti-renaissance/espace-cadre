import { useState } from 'react'
import { Box, Container, Grid, Typography } from '@mui/material'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import LinkIcon from '@mui/icons-material/Link'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import DeleteIcon from '@mui/icons-material/Delete'
import { styled } from '@mui/system'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useMutation } from '@tanstack/react-query'
import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { getFormations, deleteFormation, downloadFormation } from 'api/formations'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Loader from 'ui/Loader'
import EmptyContent from 'ui/EmptyContent'
import UICard from 'ui/Card/Card'
import Button from 'ui/Button'
import CreateEditModal from './CreateEditModal'
import ConfirmButton from 'ui/Button/ConfirmButton'

const messages = {
  title: 'Formations',
  create: 'Ajouter',
  edit: 'Modifier',
  noFormation: "Vous n'avez aucune formation créée",
  published: 'Publiée',
  unpublished: 'Non publiée',
  view: 'Afficher',
  download: 'Télécharger',
  confirmDeleteTitle: 'Suppression de la formation',
  confirmDeleteDescription: 'Êtes-vous sûr de vouloir supprimer cette formation ?',
  deleteSuccess: 'Formation supprimée avec succès',
}

const Badge = styled('span')(({ theme, isPublish = false }) => ({
  ...(isPublish
    ? {
        backgroundColor: theme.palette.colors.blue[500],
        color: theme.palette.colors.white,
      }
    : {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
      }),
  borderRadius: '4px',
  padding: '4px 8px',
  fontSize: '12px',
  fontWeight: '500',
  marginRight: '8px',
}))

const Formations = () => {
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [formation, setFormation] = useState(null)
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()

  const {
    data: paginatedFormations = null,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading,
  } = useInfiniteQueryWithScope(
    ['paginated-formations', { feature: 'Formations', view: 'Formations' }],
    getFormations,
    {
      getNextPageParam,
      onError: handleError,
    }
  )

  const { mutate: remove } = useMutation({
    mutationFn: deleteFormation,
    onSuccess: () => {
      enqueueSnackbar(messages.deleteSuccess, notifyVariants.success)
      refetch()
    },
    onError: handleError,
  })

  const toggleCreateEditModal = (formation, open) => {
    setFormation(formation)
    setIsCreateEditModalOpen(open)
  }

  const formations = usePaginatedData(paginatedFormations)

  if (isLoading) {
    return <Loader isCenter />
  }

  return (
    <Container maxWidth={false}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={
            <PageHeaderButton
              onClick={() => toggleCreateEditModal(null, true)}
              label={messages.create}
              icon={<SchoolRoundedIcon />}
              isMainButton
            />
          }
        />
      </Grid>

      {(!formations || formations.length === 0) && <EmptyContent description={messages.noFormation} />}

      {formations && formations.length > 0 && (
        <InfiniteScroll
          dataLength={formations.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<Loader />}
          style={{ marginTop: '8px' }}
        >
          <Grid container spacing={2}>
            {formations.map(formation => (
              <Grid key={formation.uuid} item xs={12} sm={6} lg={4}>
                <UICard
                  rootProps={{ sx: { pt: 2 } }}
                  header={
                    <Box className="space-y-3">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Badge isPublish={formation.published}>
                          {formation.published ? messages.published : messages.unpublished}
                        </Badge>
                        {formation.content_type === 'link' ? (
                          <LinkIcon sx={{ color: 'colors.gray.500', fontSize: '20px' }} />
                        ) : (
                          <InsertDriveFileIcon sx={{ color: 'colors.gray.500', fontSize: '20px' }} />
                        )}
                      </Box>
                      <Typography component="h2" sx={{ fontWeight: '500', color: 'colors.gray.900', fontSize: '16px' }}>
                        {formation.title}
                      </Typography>
                    </Box>
                  }
                  content={
                    <Box className="space-y-3 my-4">
                      <Typography component="p" sx={{ color: 'colors.gray.500', fontSize: '14px' }}>
                        {formation.description}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: 'colors.blue.500',
                          mt: 4,
                        }}
                      >
                        {formation.content_type === 'link' ? (
                          <Typography component="a" sx={{ fontSize: '14px' }} href={formation.link}>
                            {messages.view}
                          </Typography>
                        ) : (
                          <button
                            className="button button-link"
                            onClick={() => downloadFormation(formation.uuid, 'formations')}
                          >
                            {messages.download}
                          </button>
                        )}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 ml-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                          />
                        </svg>
                      </Box>
                    </Box>
                  }
                  actions={
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button onClick={() => toggleCreateEditModal(formation, true)} isMainButton>
                        {messages.edit}
                      </Button>
                      <ConfirmButton
                        title={messages.confirmDeleteTitle}
                        description={messages.confirmDeleteDescription}
                        onClick={() => remove(formation.uuid)}
                      >
                        <DeleteIcon sx={{ color: 'form.error..olo', fontSize: '20px' }} />
                      </ConfirmButton>
                    </Box>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}

      {isCreateEditModalOpen && (
        <CreateEditModal
          formation={formation}
          handleClose={() => toggleCreateEditModal(null, false)}
          onUpdateResolved={refetch}
          onCreateResolve={refetch}
        />
      )}
    </Container>
  )
}

export default Formations
