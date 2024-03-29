import { FormControlLabel, FormGroup, Radio } from '@mui/material'
import React from 'react'
import { VisibilityEvent } from '~/domain/event'

const VISIBILITES = [
  {
    id: VisibilityEvent.PUBLIC,
    name: 'Public',
  },
  {
    id: VisibilityEvent.PRIVATE,
    name: 'Interne',
  },
  {
    id: VisibilityEvent.ADHERENT,
    name: 'Adhérents',
  },
  {
    id: VisibilityEvent.ADHERENT_DUES,
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
    {VISIBILITES.map((item: any, index: number) => (
      <FormControlLabel
        key={index}
        control={<Radio checked={item.id === visibility} />}
        label={item.name}
        onClick={(e: React.MouseEvent<HTMLLabelElement>) => {
          register('visibility').onChange(e)
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
