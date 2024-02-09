import { useParams } from 'react-router'
import CreateActualityPage from './actuality'
import CreateNewsletterPage from './newsletter'

export default function CreatePage() {
  const { type } = useParams<{ type: string }>()
  if (type === 'actuality') {
    return <CreateActualityPage />
  }
  if (type === 'newsletter') {
    return <CreateNewsletterPage />
  }
  return null
}
