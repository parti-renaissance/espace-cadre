import { Container, Tabs, Tab as MuiTab, Typography, Box, Grid } from '@mui/material'
import { styled } from '@mui/system'
import { useState } from 'react'
import { AccessTime } from '@mui/icons-material'
import { format } from 'date-fns'
import UICard, { UIChip } from 'ui/Card'
import { HorizontalContainer, TruncatedText } from 'components/shared/styled'

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

      {selectedTab === messages.current && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <UICard
              rootProps={{ sx: { pt: 1 } }}
              headerProps={{ sx: { pt: '8px' } }}
              header={
                <>
                  <UIChip
                    color="teal700"
                    bgcolor="activeLabel"
                    label={messages.current}
                    sx={{ display: 'inline-block', width: 'fit-content', mb: 1 }}
                  />
                  <TruncatedText lines={2} sx={{ color: 'gray900', mb: 0.5, fontSize: '20px', fontWeight: 600 }}>
                    Election municipale de la Province de Grenoble
                  </TruncatedText>
                  <HorizontalContainer>
                    <AccessTime sx={{ mr: 0.5, color: 'gray600', fontSize: '14px' }} />
                    <Typography sx={{ color: 'gray600', fontSize: '14px' }}>
                      Date de debut {format(new Date(), 'dd/MM/yyyy')} à {format(new Date(), 'HH:mm')}
                    </Typography>
                  </HorizontalContainer>
                  <HorizontalContainer className="mt-1">
                    <AccessTime sx={{ mr: 0.5, color: 'gray600', fontSize: '14px' }} />
                    <Typography sx={{ color: 'gray600', fontSize: '14px' }}>
                      Date de fin {format(new Date(), 'dd/MM/yyyy')} à {format(new Date(), 'HH:mm')}
                    </Typography>
                  </HorizontalContainer>
                </>
              }
              contentProps={{ sx: { pt: 2 } }}
              content={
                <>
                  <Grid container>
                    <UIChip
                      data-cy="elections-item-count"
                      variant="outlined"
                      color="gray700"
                      label="5 groupes"
                      sx={{ mr: 1 }}
                    />
                    <UIChip
                      data-cy="elections-item-count"
                      variant="outlined"
                      color="gray700"
                      label="25 adhérents"
                      sx={{ mr: 1 }}
                    />
                  </Grid>
                </>
              }
            />
          </Grid>
        </Grid>
      )}
      {selectedTab === messages.all && <>Toutes les elections</>}
    </Container>
  )
}

export default ElectionsTab
