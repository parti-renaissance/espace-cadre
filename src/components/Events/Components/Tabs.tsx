import * as React from 'react'
import { memo } from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import Label from '~/mui/label'
import { MuiSpacing } from '~/theme/spacing'
import { fontWeight } from '~/theme/typography'

export interface TabProps {
  label: string
  id: string
  count?: number
  disabled?: boolean
  query?: any
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
            disabled={element.disabled}
            key={element.id ?? key}
            label={
              <Typography
                fontWeight={fontWeight.medium}
                fontSize={15}
                display={'flex'}
                alignItems={'center'}
                gap={MuiSpacing.small}
              >
                {element.label}

                {element?.count ? (
                  <Label color={'primary'} variant="soft">
                    {element.count}
                  </Label>
                ) : null}
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

export default memo(TabsComponent)
