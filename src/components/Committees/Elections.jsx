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
import { Tab, TabLabel } from './Tabs/styles'
import CreateEditModal from './Elections/CreateEditModal'
import Lists from './Elections/Tabs/Lists'

const messages = {
  modify: 'Modifier',
  about: 'À propos',
  list: 'Listes',
  result: 'Résultats',
}

const Elections = () => {
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState(messages.about)
  const { committeeElectionId, committeeId } = useParams()
  const { handleError } = useErrorHandler()

  const { data: committee = {} } = useQueryWithScope(
    ['committee-detail', { feature: 'Committees', view: 'Elections' }, committeeId],
    () => getCommittee(committeeId),
    {
      onError: handleError,
    }
  )

  const {
    data: election = {},
    refetch,
    isLoading,
  } = useQueryWithScope(
    ['committee-election', { feature: 'Committees', view: 'Elections' }, committeeElectionId],
    () => getCommitteeElection(committeeElectionId),
    {
      enabled: !!committeeElectionId,
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
          titleSuffix={election.designation.custom_title}
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
            <Tab
              value={messages.result}
              label={<TabLabel>{messages.result}</TabLabel>}
              disableRipple
              disableFocusRipple
              disabled
            />
          </Tabs>
        </Box>
      </Box>

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
