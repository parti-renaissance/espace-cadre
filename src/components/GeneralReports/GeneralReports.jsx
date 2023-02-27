import { useState } from 'react'
import { saveAs } from 'file-saver'
import { Box, Container, Grid, Typography } from '@mui/material'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { getFile } from 'api/upload'
import { useErrorHandler } from 'components/shared/error/hooks'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Loader from 'ui/Loader'
import EmptyContent from 'ui/EmptyContent'
import UICard from 'ui/Card/Card'
import Button from 'ui/Button'
import CreateEditModal from './CreateEditModal'
import { getDocuments } from 'api/general-meeting-report'

const messages = {
  title: "Procès-verbal d'AG",
  create: 'Ajouter',
  edit: 'Modifier',
  noDocuments: "Vous n'avez aucun document créé",
  view: 'Afficher',
  download: 'Télécharger',
}

const GenericReports = () => {
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [document, setDocument] = useState(null)
  const { handleError } = useErrorHandler()

  const {
    data: paginatedDocuments = null,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading,
  } = useInfiniteQueryWithScope(
    ['paginated-documents', { feature: 'GeneralMeetingReports', view: 'GeneralReports' }],
    getDocuments,
    {
      getNextPageParam,
      onError: handleError,
    }
  )

  const toggleCreateEditModal = (document, open) => {
    setDocument(document)
    setIsCreateEditModalOpen(open)
  }

  const documents = usePaginatedData(paginatedDocuments)

  if (isLoading) {
    return <Loader />
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
              icon={<AttachFileIcon />}
              isMainButton
            />
          }
        />
      </Grid>

      {(!documents || documents.length === 0) && <EmptyContent description={messages.noDocuments} />}

      {documents && documents.length > 0 && (
        <InfiniteScroll
          dataLength={documents.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<Loader />}
          style={{ marginTop: '8px' }}
        >
          <Grid container spacing={2}>
            {documents.map(document => (
              <Grid key={document.uuid} item xs={12} sm={6} lg={4}>
                <UICard
                  rootProps={{ sx: { pt: 2 } }}
                  header={
                    <Box className="space-y-3">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <InsertDriveFileIcon
                          sx={{ color: theme => theme.palette.colors.gray[500], fontSize: '32px' }}
                        />
                      </Box>
                      <Typography
                        component="h2"
                        sx={{ fontWeight: '500', color: theme => theme.palette.colors.gray[900], fontSize: '16px' }}
                      >
                        {document.title}
                      </Typography>
                    </Box>
                  }
                  content={
                    <Box className="space-y-3 my-4">
                      <Typography
                        component="p"
                        sx={{ color: theme => theme.palette.colors.gray[500], fontSize: '14px' }}
                      >
                        {document.description}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: theme => theme.palette.colors.blue[500],
                          mt: 4,
                        }}
                      >
                        <button
                          className="button button-link"
                          onClick={async () => {
                            const { blob, fileName } = await getFile(document.uuid, 'general_meeting_reports')
                            saveAs(blob, fileName)
                          }}
                        >
                          {messages.download}
                        </button>
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
                      <Button onClick={() => toggleCreateEditModal(document, true)} isMainButton>
                        {messages.edit}
                      </Button>
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
          document={document}
          handleClose={() => toggleCreateEditModal(null, false)}
          onUpdateResolved={refetch}
          onCreateResolve={refetch}
        />
      )}
    </Container>
  )
}

export default GenericReports
