import PropTypes from 'prop-types'
import { useState } from 'react'
import { Container, Box } from '@mui/material'
import { getCommitteeElection } from 'api/committee_election'
import { countAdherents } from 'api/activist'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { useErrorHandler } from 'components/shared/error/hooks'
import { CommitteeElection, Designation } from 'domain/committee_election'
import Loader from 'ui/Loader'
import EmptyContent from 'ui/EmptyContent'
import Button from 'ui/Button'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import About from '../Elections/Tabs/About'
import Lists from '../Elections/Tabs/Lists'
import CreateEditModal from '../Elections/CreateEditModal'

const messages = {
  create: 'Créer une élection',
  update: 'Modifier l’élection',
  soon: 'Bientôt disponible',
  view: 'Afficher',
  noElection: 'Aucune élection en cours',
  noElectionDescription: 'Aucune élection n’est en cours pour ce comité.',
}

const ElectionsTab = ({ committee, committeeElectionId }) => {
  const [designation, setDesignation] = useState(Designation.NULL)
  const [committeeElection, setCommitteeElection] = useState(CommitteeElection.NULL)
  const [adherentCount, setAdherentCount] = useState(0)
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const { handleError } = useErrorHandler()

  const { isLoading } = useQueryWithScope(
    ['committee-election-tab', { feature: 'Committees', view: 'DetailCommittee' }, committeeElectionId],
    () => getCommitteeElection(committeeElectionId),
    {
      enabled: !!committeeElectionId,
      onSuccess: setCommitteeElection,
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

  const toggleCreateEditModal = (designation, open) => {
    setDesignation(designation)
    setIsCreateEditModalOpen(open)
  }

  const { designation: electionDesignation } = committeeElection

  return (
    <Container maxWidth={false} data-cy="committee-detail-elections">
      {committeeElectionId && isLoading && <Loader />}

      {committeeElection && committeeElection.id ? (
        <Box className="space-y-8">
          <Box>
            <Box display="flex" alignItems="center" className="space-x-3">
              <Button
                onClick={() => toggleCreateEditModal(electionDesignation, true)}
                rootProps={{ sx: { color: 'whiteCorner' } }}
              >
                {!electionDesignation.id ? messages.create : messages.update}
              </Button>
              {isFetching && <Loader />}
            </Box>
            <About election={committeeElection} adherentCount={adherentCount} />
          </Box>
          <Lists election={committeeElection} />
        </Box>
      ) : (
        <EmptyContent
          title={messages.noElection}
          description={messages.noElectionDescription}
          action={
            <>
              <PageHeaderButton
                label={messages.create}
                onClick={() => toggleCreateEditModal(designation, true)}
                isMainButton
              />
            </>
          }
        />
      )}

      {isCreateEditModalOpen && (
        <CreateEditModal
          committeeUuid={committee.uuid}
          designation={designation}
          status={committeeElection?.status}
          handleClose={() => toggleCreateEditModal(designation, false)}
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
