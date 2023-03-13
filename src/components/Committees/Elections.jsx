import { Box, Container, Grid, Tabs } from '@mui/material'
import { useState } from 'react'
import { useParams } from 'react-router'
import { getCommittee } from 'api/committees'
import { getCommitteeElection } from 'api/committee_election'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { useErrorHandler } from 'components/shared/error/hooks'
import PageHeader from 'ui/PageHeader'
import EditIcon from 'ui/icons/EditIcon'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Loader from 'ui/Loader'
import paths from 'shared/paths'
import { Tab, TabLabel } from './styles'
import CreateEditModal from './Elections/CreateEditModal'
import Lists from './Elections/Tabs/Lists'
import About from './Elections/Tabs/About'
import { CommitteeElection } from 'domain/committee_election'

const messages = {
  modify: 'Modifier',
  about: 'À propos',
  list: 'Listes',
}

const Elections = () => {
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState(messages.about)
  const [election, setElection] = useState(CommitteeElection.NULL)
  const { committeeElectionId, committeeId } = useParams()
  const { handleError } = useErrorHandler()

  const { data: committee = {} } = useQueryWithScope(
    ['committee-detail', { feature: 'Committees', view: 'Elections' }, committeeId],
    () => getCommittee(committeeId),
    {
      onError: handleError,
    }
  )

  const electionId = committeeElectionId ?? committee.committee_election.uuid
  const { refetch, isLoading } = useQueryWithScope(
    ['committee-election', { feature: 'Committees', view: 'Elections' }, electionId],
    () => getCommitteeElection(electionId),
    {
      enabled: !!electionId && Object.keys(committee).length > 0,
      onSuccess: setElection,
      onError: handleError,
    }
  )

  const handleTabChange = (_, tabId) => {
    setSelectedTab(tabId)
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <Container maxWidth={false} data-cy="committee-elections-container">
      <Grid container justifyContent="space-between">
        <PageHeader
          title={committee.name}
          titleLink={`${paths.committee}/${committeeId}`}
          titleSuffix={election.designation.title}
          button={
            <PageHeaderButton
              label={messages.modify}
              icon={<EditIcon sx={{ color: 'main', fontSize: '20px' }} />}
              onClick={() => setIsCreateEditModalOpen(true)}
              isMainButton
            />
          }
        />
      </Grid>

      <Box
        data-cy="elections-tabs"
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: theme => theme.palette.colors.gray[200],
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tabs
            variant="scrollable"
            value={selectedTab}
            onChange={handleTabChange}
            TabIndicatorProps={{ sx: { bgcolor: theme => theme.palette.colors.blue[500] } }}
          >
            <Tab
              value={messages.about}
              label={<TabLabel>{messages.about}</TabLabel>}
              disableRipple
              disableFocusRipple
            />
            <Tab value={messages.list} label={<TabLabel>{messages.list}</TabLabel>} disableRipple disableFocusRipple />
          </Tabs>
        </Box>
      </Box>

      {selectedTab === messages.about && <About election={election} />}
      {selectedTab === messages.list && <Lists election={election} />}

      {isCreateEditModalOpen && (
        <CreateEditModal
          open={isCreateEditModalOpen}
          committeeUuid={committeeId}
          designation={election.designation}
          handleClose={() => setIsCreateEditModalOpen(false)}
          onCreateResolve={refetch}
        />
      )}
    </Container>
  )
}

export default Elections
