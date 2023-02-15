import PropTypes from 'prop-types'
import { Box, Container, Grid, IconButton, Typography } from '@mui/material'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import LinkIcon from '@mui/icons-material/Link'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import DeleteIcon from '@mui/icons-material/Delete'
import { styled } from '@mui/system'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { getFormations } from 'api/formations'
import { useErrorHandler } from 'components/shared/error/hooks'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Loader from 'ui/Loader'
import EmptyContent from 'ui/EmptyContent'
import UICard from 'ui/Card/Card'
import Button from 'ui/Button'

const messages = {
  title: 'Formations',
  create: 'Ajouter',
  edit: 'Modifier',
  noFormation: "Vous n'avez aucune formation créée",
  published: 'Publiée',
  unpublished: 'Non publiée',
  view: 'Afficher',
  download: 'Télécharger',
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

const Link = ({ href, children, ...props }) => (
  <Typography component="a" href={href} sx={{ fontSize: '14px' }} {...props}>
    {children}
  </Typography>
)

Link.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
}

const Formations = () => {
  const { handleError } = useErrorHandler()
  const {
    data: paginatedFormations = null,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQueryWithScope(
    ['paginated-formations', { feature: 'Formations', view: 'Formations' }],
    getFormations,
    {
      getNextPageParam,
      onError: handleError,
    }
  )

  const formations = usePaginatedData(paginatedFormations)

  if (!formations || formations.length === 0)
    <EmptyContent
      description={messages.noFormation}
      action={
        <>
          <PageHeaderButton label={messages.create} onClick={() => {}} icon={<SchoolRoundedIcon />} isMainButton />
        </>
      }
    />

  {
    isLoading && <Loader />
  }

  return (
    <Container maxWidth={false}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={
            <PageHeaderButton onClick={() => {}} label={messages.create} icon={<SchoolRoundedIcon />} isMainButton />
          }
        />
      </Grid>

      <InfiniteScroll
        dataLength={formations.length}
        next={() => fetchNextPage()}
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
                        <LinkIcon sx={{ color: theme => theme.palette.colors.gray[500], fontSize: '20px' }} />
                      ) : (
                        <InsertDriveFileIcon
                          sx={{ color: theme => theme.palette.colors.gray[500], fontSize: '20px' }}
                        />
                      )}
                    </Box>
                    <Typography
                      component="h2"
                      sx={{ fontWeight: '500', color: theme => theme.palette.colors.gray[900], fontSize: '16px' }}
                    >
                      {formation.title}
                    </Typography>
                  </Box>
                }
                content={
                  <Box className="space-y-3 my-4">
                    <Typography component="p" sx={{ color: theme => theme.palette.colors.gray[500], fontSize: '14px' }}>
                      {formation.description}
                    </Typography>
                    <Box sx={{ display: 'flex', color: theme => theme.palette.colors.blue[500], mt: 4 }}>
                      {formation.content_type === 'link' ? (
                        <Link href={formation.link}>{messages.view}</Link>
                      ) : (
                        <Link href={formation.file_path} download={true}>
                          {messages.download}
                        </Link>
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
                    <Button onClick={() => {}} isMainButton>
                      {messages.edit}
                    </Button>
                    <IconButton edge="start" color="inherit" onClick={() => {}} aria-label="delete" sx={{ ml: 0.5 }}>
                      <DeleteIcon sx={{ color: theme => theme.palette.form.error.color, fontSize: '20px' }} />
                    </IconButton>
                  </Box>
                }
              />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </Container>
  )
}

export default Formations
