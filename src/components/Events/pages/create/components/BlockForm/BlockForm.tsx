import React from 'react'
import { Grid, Stack, Typography } from '@mui/material'

type HelperSection = {
  title: string
  content: string
}

interface BlockFormProps {
  title: string
  subtitle?: string | React.ReactNode
  helpers?: HelperSection[]
  children: React.ReactNode
}

const BlockForm = ({ children, helpers, title, subtitle }: BlockFormProps) => (
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
      <Stack
        spacing={4}
        boxShadow={8}
        bgcolor={'background.paper'}
        border={1}
        borderColor={'grey.200'}
        sx={{
          width: '100%',
          padding: 4,
          borderRadius: 2,
        }}
      >
        {children}
      </Stack>
    </Grid>
  </Grid>
)

export default BlockForm
