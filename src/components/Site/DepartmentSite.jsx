import { Container } from '@mui/system'
import { useState } from 'react'
import * as Sentry from '@sentry/react'
// import { useUserScope } from '../../redux/user/hooks'
import paths from 'shared/paths'
import PageHeader from 'ui/PageHeader'
import { createSiteContent } from 'api/site'
import Editor from './Component/Editor'

const messages = {
  title: 'Site Departemental',
  titleSuffix: 'Gestion du site',
  createSuccess: 'Site créé avec succès',
  updateSuccess: 'Site modifié avec succès',
}

const clearBody = body => body.substring(body.indexOf('<table'), body.lastIndexOf('</table>') + 8)

const DepartmentSite = () => {
  const [content, setContent] = useState(null)
  const [, setLoading] = useState(false)

  const editContent = () => {
    const body = {
      zone: 'zone-uuid',
      content: clearBody(content.chunks.body),
      json_content: JSON.stringify(content.design),
    }

    return createSiteContent(body)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const body = await editContent()
      setContent(body)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      Sentry.captureException(error)
    }
  }

  return (
    <Container maxWidth="lg">
      <PageHeader title={messages.title} titleLink={paths.department_site} titleSuffix={messages.titleSuffix} />
      <Editor onContentUpdate={setContent} />
    </Container>
  )
}

export default DepartmentSite
