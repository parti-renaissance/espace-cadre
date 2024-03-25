import Page from '~/components/Page/Page'
import TabsComponent, { TabProps } from '~/components/Events/Components/Tabs'
import { useMemo, useState } from 'react'
import { Grid } from '@mui/material'
import { withBottomSpacing } from '~/theme/spacing'
import MandantTab from '~/components/Mandates/Components/MandantTab/MandantTab'

export default function MandateListPage() {
  const [currentTab, setCurrentTab] = useState(0)

  const RenderTab = useMemo(() => {
    switch (currentTab) {
      default:
        return MandantTab
    }
  }, [currentTab])

  return (
    <Page title="Procurations">
      <Grid {...withBottomSpacing} sx={{ zIndex: 10 }} id={'procurationTabsContainer'}>
        <TabsComponent elements={tabs} onChangeTab={(_, tab) => setCurrentTab(tab)} value={currentTab}></TabsComponent>
      </Grid>

      <RenderTab />
    </Page>
  )
}

const tabs: TabProps[] = [
  {
    id: 'mandant',
    label: 'Mandants à traiter',
  },
  {
    id: 'treated-mandants',
    label: 'Mandants traités',
    disabled: true,
  },
  {
    id: 'mandataires',
    label: 'Mandataires',
    disabled: true,
  },
  {
    id: 'treated-mandataires',
    label: 'Mandataires traités',
    disabled: true,
  },
]
