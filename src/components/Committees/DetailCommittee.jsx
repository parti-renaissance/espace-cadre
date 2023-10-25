import { Container, Grid, Tabs, Tab as MuiTab, Typography, Box } from '@mui/material'
import { styled } from '@mui/system'
import { useState } from 'react'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import { useMutation } from '@tanstack/react-query'
import { deleteCommittee, getCommittee } from 'api/committees'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { useErrorHandler } from 'components/shared/error/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import EditIcon from 'ui/icons/EditIcon'
import Loader from 'ui/Loader'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import ConfirmButton from 'ui/Button/ConfirmButton'
import paths from 'shared/paths'
import features from 'shared/features'
import CreateEditModal from './CreateEditModal'
import InformationTab from './Tabs/InformationTab'
import ElectionsTab from './Tabs/ElectionsTab'
import { useUserScope } from '../../redux/user/hooks'
import { electionStatus } from './constants'

const Tab = styled(MuiTab)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.gray400,
  '&.Mui-selected': {
    color: theme.palette.gray800,
  },
}))

const TabLabel = styled(Typography)`
  font-size: 18px;
  font-weight: 400;
  line-height: 27px;
`

const messages = {
  title: 'Comités',
  modify: 'Modifier le comité',
  informations: 'Informations',
  elections: 'Élections',
}

const DetailCommittee = () => {
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState(messages.informations)
  const [currentScope] = useUserScope()
  const { committeeId } = useParams()
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()

  const {
    data: committee = {},
    refetch,
    isLoading,
  } = useQueryWithScope(
    ['committee-detail', { feature: 'Committees', view: 'DetailCommittee' }, committeeId],
    () => getCommittee(committeeId),
    {
      onError: handleError,
    }
  )

  const { mutate, isLoading: loading } = useMutation({
    mutationFn: deleteCommittee,
    onSuccess: () => {
      enqueueSnackbar('Le comité supprimé avec succès', notifyVariants.success)
      navigate(generatePath(paths.committee))
    },
    onError: handleError,
  })

  const handleTabChange = (_, tabId) => {
    setSelectedTab(tabId)
  }

  if (isLoading) {
    return <Loader isCenter />
  }

  return (
    <Container maxWidth={false} data-cy="committee-detail-container">
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          titleLink={paths.committee}
          titleSuffix={committee.name}
          badge={
            <>
              {[electionStatus.scheduled, electionStatus.in_progress].includes(
                committee.committee_election?.status
              ) && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                    color: 'colors.green.700',
                    bgcolor: 'colors.green.100',
                    px: 1,
                    py: 0.5,
                    borderRadius: '16px',
                  }}
                  className="space-x-2"
                >
                  <Box
                    sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'colors.green.500' }}
                    className="pulse"
                  />
                  <span>Élection en cours ou programmée</span>
                </Box>
              )}
            </>
          }
          button={
            <Box display="flex" alignItems="center" className="space-x-3">
              {loading && <Loader />}
              <PageHeaderButton
                label={messages.modify}
                icon={<EditIcon sx={{ color: 'main', fontSize: '20px' }} />}
                onClick={() => setIsCreateEditModalOpen(true)}
                disabled={[electionStatus.scheduled, electionStatus.in_progress].includes(
                  committee.committee_election?.status
                )}
                isMainButton
              />
              {![electionStatus.scheduled, electionStatus.in_progress].includes(
                committee.committee_election?.status
              ) && (
                <ConfirmButton
                  title="Suppression du comité"
                  description="Êtes-vous sûr de vouloir supprimer ce comité ? Cette action est irréversible"
                  onClick={() => mutate(committee.uuid)}
                >
                  <DeleteIcon sx={{ color: 'form.error.color', fontSize: '20px' }} />
                </ConfirmButton>
              )}
            </Box>
          }
        />
      </Grid>

      <Grid container data-cy="committee-detail-tabs" sx={{ mb: 1 }}>
        <Tabs
          variant="scrollable"
          value={selectedTab}
          onChange={handleTabChange}
          TabIndicatorProps={{ sx: { bgcolor: 'colors.blue.500' } }}
          sx={{ my: 2 }}
        >
          <Tab
            value={messages.informations}
            label={<TabLabel>{messages.informations}</TabLabel>}
            disableRipple
            disableFocusRipple
            data-cy="committee-detail-tab-info"
          />
          {currentScope.hasFeature(features.designation) && (
            <Tab
              value={messages.elections}
              label={<TabLabel>{messages.elections}</TabLabel>}
              disableRipple
              disableFocusRipple
              data-cy="committee-detail-tab-elections"
            />
          )}
        </Tabs>
      </Grid>

      {selectedTab === messages.informations && <InformationTab committee={committee} />}
      {selectedTab === messages.elections && (
        <ElectionsTab committee={committee} committeeElectionId={committee.committee_election?.uuid} />
      )}

      {isCreateEditModalOpen && (
        <CreateEditModal
          open={isCreateEditModalOpen}
          committeeId={committeeId}
          handleClose={() => setIsCreateEditModalOpen(false)}
          onCreateResolve={refetch}
        />
      )}
    </Container>
  )
}

export default DetailCommittee
