import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Referrals from './Pages/Referrals.js'
import Scoreboard from './Pages/Scoreboard'
import { Box, Container, Grid, Tab, Tabs } from '@mui/material'
import paths from '~/shared/paths'
import { FeatureEnum } from '~/models/feature.enum'
import PageHeader from '~/ui/PageHeader'

const ReferralsRoute = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const tabValue = location.pathname.endsWith('/historique') ? 1 : 0

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    navigate(
      newValue === 0 ? `${paths[FeatureEnum.REFERRALS]}/classement` : `${paths[FeatureEnum.REFERRALS]}/historique`
    )
  }

  return (
    <Container maxWidth={false} data-cy="contacts-container">
      <Grid container justifyContent="space-between">
        <PageHeader title={'Parrainages'} />
      </Grid>

      <Box sx={{ borderBottom: 1, marginBottom: 3, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Classement" />
          <Tab label="Historique" />
        </Tabs>
      </Box>

      <Routes>
        <Route path="/classement" element={<Scoreboard />} />
        <Route path="/historique" element={<Referrals />} />
        <Route path="*" element={<Scoreboard />} />
      </Routes>
    </Container>
  )
}

export default ReferralsRoute
