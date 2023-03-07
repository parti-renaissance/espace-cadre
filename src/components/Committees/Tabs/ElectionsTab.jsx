import { Container, Tabs, Tab as MuiTab, Typography, Box } from '@mui/material'
import { styled } from '@mui/system'
import { useState } from 'react'

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
}

const ElectionsTab = () => {
  const [selectedTab, setSelectedTab] = useState(messages.current)

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
          borderBottom: '1px solid',
          borderColor: theme => theme.palette.colors.gray[200],
        }}
      >
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

      {selectedTab === messages.current && <h2>Aucune Election</h2>}
      {selectedTab === messages.all && <h2>Toutes les elections</h2>}
    </Container>
  )
}

export default ElectionsTab
