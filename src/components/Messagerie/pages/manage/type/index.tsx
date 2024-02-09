import TypeSelector from './TypeSelector'
import { Button, Container, Stack } from '@mui/material'
import ManageLayout from '~/components/Messagerie/pages/manage/Layout'
import { useNavigate } from 'react-router-dom'
import { paths as messageriePaths } from '~/components/Messagerie/shared/paths'
import React from 'react'

const sidebarProps = {
  title: 'Type',
  subtitle: 'Choisissez votre type de courriel.',
}

export default function ChooseTypePage() {
  const [selectedType, setSelectedType] = React.useState('newsletter')
  const navigate = useNavigate()
  const nextPath = selectedType === 'actuality' ? messageriePaths.createActuality : messageriePaths.createNewsletter
  const textButton = selectedType === 'actuality' ? 'Écrire une actualité' : 'Écrire une newsletter'
  return (
    <ManageLayout {...sidebarProps}>
      <Stack spacing={4} sx={{ mt: 2 }}>
        <TypeSelector onChange={setSelectedType} />
        <Button variant="contained" sx={{ alignSelf: 'flex-end' }} onClick={() => navigate(nextPath)}>
          {textButton}
        </Button>
      </Stack>
    </ManageLayout>
  )
}
