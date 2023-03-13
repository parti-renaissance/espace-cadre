import PropTypes from 'prop-types'
import { useState } from 'react'
import { Container, Tabs, Typography, Box, Grid } from '@mui/material'
import { AccessTime } from '@mui/icons-material'
import { format } from 'date-fns'
import { generatePath, useNavigate } from 'react-router'
import { getCommitteeElection } from 'api/committee_election'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { useErrorHandler } from 'components/shared/error/hooks'
import { TruncatedText, HorizontalContainer } from 'components/shared/styled'
import Button from 'ui/Button'
import Loader from 'ui/Loader'
import UICard from 'ui/Card/Card'
import { UIChip } from 'ui/Card'
import EmptyContent from 'ui/EmptyContent'
import paths from 'shared/paths'
import CreateEditModal from '../Elections/CreateEditModal'
import { Tab, TabLabel } from '../styles'
import { CommitteeElection, Designation } from 'domain/committee_election'

const messages = {
  history: 'Historiques',
  current: 'En cours',
  all: 'Toutes',
  create: 'Créer une élection',
  soon: 'Bientôt disponible',
  view: 'Afficher',
  noElection: 'Aucune élection en cours',
  noElectionDescription: 'Aucune élection n’est en cours pour ce comité.',
}

const ElectionsTab = ({ committeeUuid, committeeElectionId }) => {
  const [selectedTab, setSelectedTab] = useState(messages.current)
  const [designation, setDesignation] = useState(Designation.NULL)
  const [committeeElection, setCommitteeElection] = useState(CommitteeElection.NULL)
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const { handleError } = useErrorHandler()
  const navigate = useNavigate()

  const { isLoading } = useQueryWithScope(
    ['committee-election-tab', { feature: 'Committees', view: 'DetailCommittee' }, committeeElectionId],
    () => getCommitteeElection(committeeElectionId),
    {
      enabled: !!committeeElectionId,
      onSuccess: setCommitteeElection,
      onError: handleError,
    }
  )

  const handleView = (committeeId, committeeElectionId) => () => {
    navigate(
      generatePath(`${paths.committee}/:committeeId/elections/:committeeElectionId`, {
        committeeId,
        committeeElectionId,
      })
    )
  }

  const { designation: designationElection } = committeeElection

  const toggleCreateEditModal = (designation, open) => {
    setDesignation(designation)
    setIsCreateEditModalOpen(open)
  }

  const handleTabChange = (_, tabId) => {
    setSelectedTab(tabId)
  }

  return (
    <Container maxWidth={false} data-cy="committee-detail-elections">
      <Box
        data-cy="committee-detail-tabs"
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
          <Typography variant="h6" sx={{ mr: 2 }}>
            {messages.history}
          </Typography>
          <Tabs
            variant="scrollable"
            value={selectedTab}
            onChange={handleTabChange}
            TabIndicatorProps={{ sx: { bgcolor: theme => theme.palette.colors.blue[500] } }}
          >
            <Tab
              value={messages.current}
              label={<TabLabel>{messages.current}</TabLabel>}
              disableRipple
              disableFocusRipple
            />
            <Tab value={messages.all} label={<TabLabel>{messages.all}</TabLabel>} disableRipple disableFocusRipple />
          </Tabs>
        </Box>
        <Button onClick={() => toggleCreateEditModal(designation, true)} rootProps={{ sx: { color: 'whiteCorner' } }}>
          {messages.create}
        </Button>
      </Box>

      {isLoading && committeeElectionId && <Loader />}

      {selectedTab === messages.current && (
        <Grid container spacing={3}>
          {committeeElection.id && designationElection.id ? (
            <Grid item xs={12} sm={6} lg={4}>
              <UICard
                rootProps={{ sx: { pt: 1 } }}
                headerProps={{ sx: { pt: 2 } }}
                header={
                  <>
                    <UIChip
                      color="teal700"
                      bgcolor="activeLabel"
                      label={messages.current}
                      sx={{ display: 'inline-flex', width: 'fit-content', mb: 1 }}
                    />
                    <TruncatedText variant="h6" sx={{ mb: 2 }} lines={2}>
                      {designationElection.title}
                    </TruncatedText>
                    <HorizontalContainer>
                      <AccessTime sx={{ mr: 0.5, color: 'gray600', fontSize: '16px' }} />
                      <Typography
                        variant="span"
                        sx={{ color: theme => theme.palette.colors.gray[600], fontSize: '14px' }}
                      >
                        Date de debut : {format(designationElection.voteStartDate, 'dd/MM/yyyy à HH:mm:ss')}
                      </Typography>
                    </HorizontalContainer>
                    <HorizontalContainer>
                      <AccessTime sx={{ mr: 0.5, color: 'gray600', fontSize: '16px' }} />
                      <Typography
                        variant="span"
                        sx={{ color: theme => theme.palette.colors.gray[600], fontSize: '14px' }}
                      >
                        Date de fin : {format(designationElection.voteEndDate, 'dd/MM/yyyy à HH:mm:ss')}
                      </Typography>
                    </HorizontalContainer>
                  </>
                }
                actionsProps={{ sx: { justifyContent: 'flex-end', mt: 3, width: 'fit-content' } }}
                actions={
                  <>
                    <Button onClick={handleView(committeeUuid, committeeElectionId)} isMainButton>
                      {messages.view}
                    </Button>
                  </>
                }
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <EmptyContent title={messages.noElection} description={messages.noElectionDescription} />
            </Grid>
          )}
        </Grid>
      )}

      {selectedTab === messages.all && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          {messages.soon}
        </Typography>
      )}

      {isCreateEditModalOpen && (
        <CreateEditModal
          committeeUuid={committeeUuid}
          designation={designation}
          handleClose={() => toggleCreateEditModal(null, false)}
        />
      )}
    </Container>
  )
}

export default ElectionsTab

ElectionsTab.propTypes = {
  committeeUuid: PropTypes.string.isRequired,
  committeeElectionId: PropTypes.string,
}
