import { FormControlLabel, FormGroup, Radio } from '@mui/material'
import React from 'react'
import { VisibilityEvent } from '~/domain/event'

const VISIBILITES = [
  {
    id: 'public',
    name: 'Public',
  },
  {
    id: 'private',
    name: 'Interne',
  },
  {
    id: 'adherent',
    name: 'Adhérents',
  },
  {
    id: 'adherent_dues',
    name: 'Adhérent à jour de cotisation',
  },
]

interface VisibilityProps {
  visibility: VisibilityEvent
  onClick: (e: React.MouseEvent<HTMLLabelElement>, visibility: VisibilityEvent) => void
  register: any
}

const Visibility = ({ visibility, onClick, register }: VisibilityProps) => (
  <FormGroup row>
    {VISIBILITES?.map((item: any) => (
      <FormControlLabel
        key={item.slug}
        control={<Radio checked={item.id === visibility} />}
        label={item.name}
        onClick={(e: React.MouseEvent<HTMLLabelElement>) => {
          register('visibilityId').onChange(e)
          onClick(e, item.id)
        }}
        sx={{
          '& .MuiFormControlLabel-label': {
            fontSize: 16,
          },
        }}
      />
    ))}
  </FormGroup>
)
export default Visibility
