import * as React from 'react'
import { Tabs, Tab, Box } from '@mui/material'

interface TabProps {
  label: string
  id: string
}

interface TabsProps {
  elements?: TabProps[]
  value: string
  onChangeTab: (event: React.SyntheticEvent, index: number) => void
}

const TabsComponent = ({ elements, value, onChangeTab }: TabsProps) => {
  const a11yProps = (id: string) => ({
    id: `tab-${id}`,
    'aria-controls': `tab-${id}`,
  })

  const handleChange = (event: React.SyntheticEvent, index: number) => {
    onChangeTab(event, index)
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} onChange={handleChange} aria-label="Événements">
        {elements?.map((element, key) => <Tab key={key} label={element.label} {...a11yProps(element.label)} />)}
      </Tabs>
    </Box>
  )
}

export default TabsComponent
