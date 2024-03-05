import * as React from 'react'
import { Tabs, Tab, Box, Typography } from '@mui/material'
import Label from '~/mui/label'

interface TabProps {
  label: string
  id: string
  count?: number
}

interface TabsProps {
  elements?: TabProps[]
  value: number
  onChangeTab: (event: React.SyntheticEvent, index: number) => void
}

const TabsComponent = ({ elements, value, onChangeTab }: TabsProps) => {
  const handleChange = (event: React.SyntheticEvent, index: number) => {
    onChangeTab(event, index)
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} onChange={handleChange} aria-label="Événements">
        {elements?.map((element, key) => (
          <Tab
            key={key}
            label={
              <Typography fontWeight={'500'} fontSize={15} mx={2} display={'flex'} alignItems={'center'} gap={1}>
                {element.label}

                {element === undefined || element.count === undefined ? null : (
                  <Label color={'primary'} variant="soft">
                    {element.count}
                  </Label>
                )}
              </Typography>
            }
            id={`tab-${element.label}`}
            aria-label={element.label}
            aria-controls={`tab-${element.label}`}
          />
        ))}
      </Tabs>
    </Box>
  )
}

export default TabsComponent
