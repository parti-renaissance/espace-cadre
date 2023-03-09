import PropTypes from 'prop-types'
import { useState } from 'react'
import { Container, Tabs, Tab as MuiTab, Typography, Box, Grid } from '@mui/material'
import { styled } from '@mui/system'
import { AccessTime } from '@mui/icons-material'
import { format } from 'date-fns'
import { getCommitteeElection } from 'api/committees'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { useErrorHandler } from 'components/shared/error/hooks'
import { TruncatedText, HorizontalContainer } from 'components/shared/styled'
import Button from 'ui/Button'
import Loader from 'ui/Loader'
import UICard from 'ui/Card/Card'
import CreateEditModal from '../Elections/CreateEditModal'
import { UIChip } from 'ui/Card'

const Tab = styled(MuiTab)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.colors.gray[400],
  '&.Mui-selected': {
    color: theme.palette.colors.blue[500],
  },
}))

const TabLabel = styled(Typography)`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`

const messages = {
  history: 'Historiques',
  current: 'En cours',
  all: 'Toutes',
  create: 'Créer une élection',
  soon: 'Bientôt disponible',
}

const ElectionsTab = ({ committeeUuid, committeeElectionId }) => {
  const [selectedTab, setSelectedTab] = useState(messages.current)
  const [designation, setDesignation] = useState()
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const { handleError } = useErrorHandler()

  const { data: committeeElection = {}, isLoading } = useQueryWithScope(
    ['committee-election', { feature: 'Committees', view: 'DetailCommittee' }, committeeElectionId],
    () => getCommitteeElection(committeeElectionId),
    {
      enabled: !!committeeElectionId,
      onError: handleError,
    }
  )

  const { designation: election } = committeeElection

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
        <Button onClick={() => toggleCreateEditModal(null, true)} rootProps={{ sx: { color: 'whiteCorner' } }}>
          {messages.create}
        </Button>
      </Box>

      {isLoading && <Loader />}

      {selectedTab === messages.current && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={4}>
            {election && (
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
                      {election.custom_title}
                    </TruncatedText>
                    <HorizontalContainer>
                      <AccessTime sx={{ mr: 0.5, color: 'gray600', fontSize: '16px' }} />
                      <Typography
                        variant="span"
                        sx={{ color: theme => theme.palette.colors.gray[600], fontSize: '14px' }}
                      >
                        Date de debut : {format(new Date(election.vote_start_date), 'dd/MM/yyyy à HH:mm:ss')}
                      </Typography>
                    </HorizontalContainer>
                    <HorizontalContainer>
                      <AccessTime sx={{ mr: 0.5, color: 'gray600', fontSize: '16px' }} />
                      <Typography
                        variant="span"
                        sx={{ color: theme => theme.palette.colors.gray[600], fontSize: '14px' }}
                      >
                        Date de fin : {format(new Date(election.vote_end_date), 'dd/MM/yyyy à HH:mm:ss')}
                      </Typography>
                    </HorizontalContainer>
                  </>
                }
              />
            )}
          </Grid>
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
