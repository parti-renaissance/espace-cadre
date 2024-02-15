import { Grid, Stack, Typography } from '@mui/material'
import React from 'react'

type HelperSection = {
  title: string
  content: string
}

interface CreateMessageLayoutProps {
  title: string
  subtitle?: string | React.ReactNode
  helpers?: HelperSection[]
  children: React.ReactNode
}

export default function CreateMessageLayout({ children, helpers, title, subtitle }: CreateMessageLayoutProps) {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Stack spacing={2}>
          <Typography variant="h6">{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          <Stack direction="column" spacing={2}>
            {helpers?.map((helper, index) => (
              <Stack key={index} spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  {helper.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {helper.content}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12} md={8}>
        {children}
      </Grid>
    </Grid>
  )
}
