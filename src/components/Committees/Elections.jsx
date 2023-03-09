import { Container } from '@mui/material'
import { useState } from 'react'

const messages = {
  modify: 'Modifier',
  about: 'À propos',
  list: 'Listes',
  result: 'Résultats',
}

const Elections = () => {
  const [selectedTab, setSelectedTab] = useState(messages.about)
  return <Container maxWidth={false} data-cy="committee-elections-container"></Container>
}

export default Elections
