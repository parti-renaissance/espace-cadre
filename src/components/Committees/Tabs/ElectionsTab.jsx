import PropTypes from 'prop-types'
import { useState } from 'react'
import { Container, Box, Grid, Tabs } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { getCommitteeElection } from 'api/committee_election'
import { countAdherents } from 'api/activist'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { cancelDesignation, getDesignation, resultsDesignation } from 'api/designations'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { CommitteeElection, Designation } from 'domain/committee_election'
import Loader from 'ui/Loader'
import EmptyContent from 'ui/EmptyContent'
import Button from 'ui/Button'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import About from '../Elections/Tabs/About'
import Lists from '../Elections/Tabs/Lists'
import CreateEditModal from '../Elections/CreateEditModal'
import { electionStatus } from '../constants'
import { Tab, TabLabel } from '../styles'
import Participants from '../Participants'

const messages = {
  create: 'Créer une élection',
  update: 'Modifier l’élection',
  soon: 'Bientôt disponible',
  view: 'Afficher',
  noElection: 'Aucune élection en cours',
  noElectionDescription: 'Aucune élection n’est en cours pour ce comité.',
  candidatures: 'Candidatures',
  lists: 'Corps électoral',
}

const ElectionsTab = ({ committee, committeeElectionId }) => {
  const [designation, setDesignation] = useState(Designation.NULL)
  const [committeeElection, setCommitteeElection] = useState(CommitteeElection.NULL)
  const [adherentCount, setAdherentCount] = useState(0)
  const [selectedTab, setSelectedTab] = useState(messages.candidatures)
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [isNewCreationMode, setIsNewCreationMode] = useState(false)
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()

  const { isLoading, refetch } = useQueryWithScope(
    ['committee-election-tab', { feature: 'Committees', view: 'DetailCommittee' }, committeeElectionId],
    () => getCommitteeElection(committeeElectionId),
    {
      enabled: !!committeeElectionId,
      onSuccess: setCommitteeElection,
      onError: handleError,
    }
  )

  const { isLoading: isDesignationLoading } = useQueryWithScope(
    ['election-designation', { feature: 'Committees', view: 'AboutDesignation' }, committeeElection.designation.id],
    () => getDesignation(committeeElection.designation.id),
    {
      enabled: !!committeeElection?.designation?.id,
      onSuccess: setDesignation,
      onError: handleError,
    }
  )

  const { isFetching } = useQueryWithScope(
    ['count-adherent', committee.zones],
    () => countAdherents(committee.zones.map(zone => zone.uuid)),
    {
      enabled: committee.zones.length > 0,
      onSuccess: count => setAdherentCount(count.adherent),
    }
  )

  const { data: results = [], isFetching: IsResultsLoading } = useQueryWithScope(
    ['designation-results', { feature: 'Committees' }],
    () => resultsDesignation(committeeElection.designation.id),
    {
      enabled: committeeElection.status === electionStatus.closed,
      onError: handleError,
    }
  )

  const { mutate, isLoading: loading } = useMutation(cancelDesignation, {
    onSuccess: () => {
      enqueueSnackbar("L'élection a été annulée avec succès", notifyVariants.success)
      refetch()
    },
    onError: handleError,
  })

  const toggleCreateEditModal = (designation, open) => {
    setDesignation(designation)
    setIsCreateEditModalOpen(open)
  }

  const handleTabChange = (_, tabId) => setSelectedTab(tabId)

  return (
    <Container maxWidth={false} data-cy="committee-detail-elections">
      {committeeElectionId && isLoading && <Loader isCenter />}

      {!committeeElectionId && (
        <EmptyContent
          title={messages.noElection}
          description={messages.noElectionDescription}
          action={
            <>
              <PageHeaderButton label={messages.create} onClick={() => setIsNewCreationMode(true)} isMainButton />
            </>
          }
        />
      )}

      {committeeElection && committeeElection.id && (
        <>
          <div>
            <Box display="flex" alignItems="center" className="space-x-3">
              {committeeElection.canCreateNew() && (
                <Button onClick={() => setIsNewCreationMode(true)} rootProps={{ sx: { color: 'whiteCorner' } }}>
                  Créer une nouvelle élection
                </Button>
              )}

              {committeeElection.isEditable() && (
                <Box display="flex" alignItems="center" className="space-x-3">
                  <Button
                    onClick={() => toggleCreateEditModal(designation, true)}
                    rootProps={{ sx: { color: 'whiteCorner' } }}
                  >
                    {!designation.id ? messages.create : messages.update}
                  </Button>
                  {(isFetching || isDesignationLoading) && <Loader />}
                </Box>
              )}

              {loading && <Loader />}
            </Box>

            {designation.id && (
              <About
                status={committeeElection.status}
                voteCount={committeeElection.voteCount}
                votersCount={committeeElection.votersCount}
                designation={designation}
                adherentCount={adherentCount}
                results={results[0]}
                cancelElection={() => mutate(designation.id)}
              />
            )}
          </div>
          <div className="mt-8">
            <Grid
              container
              data-cy="committee-election-tabs"
              sx={{
                borderTop: '1px solid',
                borderTopColor: 'colors.gray.200',
                pt: 2.5,
                mb: 1,
              }}
            >
              <Tabs
                variant="scrollable"
                value={selectedTab}
                onChange={handleTabChange}
                TabIndicatorProps={{ sx: { bgcolor: 'colors.blue.500' } }}
                sx={{ my: 2 }}
              >
                <Tab
                  value={messages.candidatures}
                  label={<TabLabel>{messages.candidatures}</TabLabel>}
                  disableRipple
                  disableFocusRipple
                />
                <Tab
                  value={messages.lists}
                  label={<TabLabel>{messages.lists}</TabLabel>}
                  disableRipple
                  disableFocusRipple
                  disabled={committeeElection.isDateEditable() || committeeElection.isCanceled()}
                />
              </Tabs>
            </Grid>
            {selectedTab === messages.candidatures && (
              <Lists election={committeeElection} isResultsLoading={IsResultsLoading} results={results[0]} />
            )}
            {selectedTab === messages.lists && designation.id && <Participants designationId={designation.id} />}
          </div>
        </>
      )}

      {isCreateEditModalOpen && (
        <CreateEditModal
          committeeUuid={committee.uuid}
          designation={designation}
          election={committeeElection}
          handleClose={() => toggleCreateEditModal(designation, false)}
        />
      )}

      {isNewCreationMode && (
        <CreateEditModal
          committeeUuid={committee.uuid}
          designation={Designation.NULL}
          election={CommitteeElection.NULL}
          handleClose={() => setIsNewCreationMode(false)}
        />
      )}
    </Container>
  )
}

export default ElectionsTab

ElectionsTab.propTypes = {
  committee: PropTypes.object,
  committeeElectionId: PropTypes.string,
}
