import { Container, Grid, Tabs, Tab as MuiTab, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCommittee } from 'api/committees'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useQueryWithScope } from 'api/useQueryWithScope'
import EditIcon from 'ui/icons/EditIcon'
import Loader from 'ui/Loader'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import paths from 'shared/paths'
import CreateEditModal from './CreateEditModal'

const Tab = styled(MuiTab)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.gray400,
  '&.Mui-selected': {
    color: theme.palette.gray800,
  },
}))

const TabLabel = styled(Typography)`
  font-size: 18px;
  font-size: 18px;
  font-weight: 400;
  line-height: 27px;
`

const messages = {
  title: 'Comités',
  modify: 'Modifier',
  informations: 'Informations',
  elections: 'Élections',
}

const DetailCommittee = () => {
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState(messages.informations)
  const { committeeId } = useParams()
  const { handleError } = useErrorHandler()

  const {
    data: committeeDetail = {},
    refetch,
    isLoading,
  } = useQueryWithScope(
    ['committee-detail', { feature: 'Committees', view: 'DetailCommittee' }, committeeId],
    () => getCommittee(committeeId),
    {
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
    <Container maxWidth={false}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          titleLink={paths.committee}
          titleSuffix={committeeDetail.name}
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

      <Grid container data-cy="DTD-campaigns-list">
        <Tabs
          variant="scrollable"
          value={selectedTab}
          onChange={handleTabChange}
          TabIndicatorProps={{ sx: { bgcolor: theme => theme.palette.colors.blue[500] } }}
          sx={{ my: 2 }}
        >
          <Tab
            value={messages.informations}
            label={<TabLabel>{messages.informations}</TabLabel>}
            disableRipple
            disableFocusRipple
          />
          <Tab
            value={messages.elections}
            label={<TabLabel>{messages.elections}</TabLabel>}
            disableRipple
            disableFocusRipple
          />
        </Tabs>
      </Grid>

      {selectedTab === messages.informations && <div>Information</div>}
      {selectedTab === messages.elections && <div>Elections</div>}

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
