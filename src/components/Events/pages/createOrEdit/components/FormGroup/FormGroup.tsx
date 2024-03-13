import React from 'react'

import { FormLabel, FormGroup as FormGroupMUI, Box } from '@mui/material'

interface FormGroupProps {
  label?: string
  children: React.ReactNode
}

const FormGroup = ({ label, children }: FormGroupProps) => (
  <FormGroupMUI>
    {label && (
      <FormLabel component={'span'} sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary' }}>
        {label}
      </FormLabel>
    )}

    <Box mt={2}>{children}</Box>
  </FormGroupMUI>
)

export default FormGroup
