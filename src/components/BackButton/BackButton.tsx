import Iconify from '~/mui/iconify'
import { useCallback } from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function BackButton() {
  const navigate = useNavigate()

  const onGoBack = useCallback(() => navigate(-1), [navigate])

  return (
    <Button startIcon={<Iconify icon="eva:arrow-ios-back-fill" />} onClick={onGoBack}>
      Retour
    </Button>
  )
}
