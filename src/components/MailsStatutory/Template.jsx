import * as Sentry from '@sentry/react'
import { useEffect, useMemo, useState } from 'react'
import { Box, Grid, Container as MuiContainer } from '@mui/material'
import { styled } from '@mui/system'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { createMessageContent, getMessageContent, getTemplate, updateMessageContent } from '~/api/messagerie'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { useErrorHandler } from '~/components/shared/error/hooks'
import StepButton from '~/components/Messagerie/Component/StepButton'
import { paths as messageriePaths } from '~/components/Messagerie/shared/paths'
import paths from '~/shared/paths'
import Input from '~/ui/Input/Input'
import PageHeader from '~/ui/PageHeader'
import Loader from '~/ui/Loader'
import InputLabel from '~/ui/InputLabel/InputLabel'
import { notifyVariants, notifyMessages } from '../shared/notification/constants'
import { useCustomSnackbar } from '../shared/notification/hooks'
import Editor from '~/components/MailsStatutory/Editor'
import { useUserScope } from '~/redux/user/hooks'
import { uniqBy } from 'lodash'

const Container = styled(Grid)(
  ({ theme }) => `
  background: ${theme.palette.colors.white};
  padding: ${theme.spacing(2)};
  border-radius: 12px 12px 0 0;
`
)

const messages = {
  title: 'Emails statutaires',
  titleSuffix: 'Envoyer un email',
  createSuccess: 'Mail créé avec succès',
  updateSuccess: 'Mail modifié avec succès',
}

const mergeContent = (content, templateValues) => {
  Object.entries(templateValues).map(([key, value]) => {
    if (value) {
      let result = JSON.stringify(value.replace(/(?:\r\n|\r|\n)/g, '<br/>'))
      result = result.slice(1, -1)

      // eslint-disable-next-line no-param-reassign
      content = content.replace(new RegExp(`{{${key}:[^}]+}}`, 'g'), result)
    }
  })

  return content
}

const Template = () => {
  const [messageSubject, setMessageSubject] = useState('')
  const [loading, setLoading] = useState(false)
  const { handleError } = useErrorHandler()
  const navigate = useNavigate()
  const { messageUuid } = useParams()
  const [searchParams] = useSearchParams()
  const templateId = searchParams.get('templateId')
  const [templateValues, setTemplateValues] = useState({})
  const { enqueueSnackbar } = useCustomSnackbar()
  const [currentScope] = useUserScope()

  const handleClickNext = async () => {
    try {
      setLoading(true)
      const body = await editEmail()
      enqueueSnackbar(templateId ? messages.updateSuccess : messages.createSuccess, notifyVariants.success)
      navigate(`../${body.uuid}/${messageriePaths.send}`)
    } catch (e) {
      Sentry.captureException(e)
      enqueueSnackbar(notifyMessages.errorTitle, notifyVariants.error)
      setLoading(false)
    }
  }

  const { data: messageContent = null, isFetching } = useQueryWithScope(
    ['message-content-template', { feature: 'MailsStatutory', view: 'TemplateEditor' }],
    () => (templateId ? getTemplate(templateId) : getMessageContent(messageUuid)),
    { onError: handleError, enabled: !!messageUuid || !!templateId }
  )

  const templateVars = useMemo(() => {
    if (!messageContent?.content) {
      return []
    }

    return uniqBy(
      [...messageContent.content.concat(messageContent.subject ?? '').matchAll(/{{([\w_]+):"([^"]+)":?([^}]*)}}/g)].map(
        item => ({
          key: item[1],
          label: item[2],
          flags: item[3].split(',').filter(Boolean),
        })
      ),
      item => item.key
    )
  }, [messageContent])

  useEffect(() => {
    templateVars
      .filter(item => item.key.indexOf('_') === 0)
      .forEach(item => {
        let value = ''

        if (item.key === '_scope') {
          if (item.label === 'zone_name') {
            value = currentScope.getZoneName()
          }
        }
        setTemplateValues(prevState => ({ ...prevState, [item.key]: value }))
      })
  }, [currentScope, templateVars])

  useEffect(() => {
    if (messageContent) {
      setMessageSubject(mergeContent(messageSubject ? messageSubject : messageContent.subject ?? '', templateValues))
    }
  }, [messageContent, templateValues])

  const editEmail = () => {
    const body = {
      type: 'statutory',
      label: `DataCorner: ${messageSubject}`,
      subject: messageSubject,
      content: mergeContent(messageContent.content, templateValues),
      json_content: messageContent.json_content,
    }

    if (messageUuid) {
      return updateMessageContent(messageUuid, body)
    }
    return createMessageContent(body)
  }

  return (
    <MuiContainer maxWidth={false}>
      <PageHeader title={messages.title} titleLink={paths.statutory_message} titleSuffix={messages.titleSuffix} />
      {isFetching ? (
        <Loader isCenter />
      ) : (
        <>
          <Container container>
            <Grid item xs={4} sx={{ justifyContent: 'spaceBetween', mr: 2 }}>
              <Input
                size="small"
                label="Objet de l'email"
                variant="outlined"
                value={messageSubject}
                disabled={!messageContent.subject_editable}
                onChange={messageContent.subject_editable ? event => setMessageSubject(event.target.value) : () => {}}
                sx={{ width: '100%' }}
                data-cy="mail-object-input"
              />
            </Grid>
            <Grid item xs={5} />
            <Grid item xs>
              <StepButton
                label="Suivant"
                loading={loading}
                disabled={loading || !messageSubject}
                onClick={handleClickNext}
              />
            </Grid>
          </Container>
          <Box sx={{ display: 'flex', bgcolor: 'whiteCorner' }} className="space-x-4">
            <Editor
              onMessageUpdate={() => {}}
              messageContent={{
                ...messageContent,
                json_content: mergeContent(messageContent.json_content, templateValues),
              }}
              readOnly
            />
            <Box sx={{ pr: 1.5, flex: '1 1 0%' }} className="space-y-5">
              {templateVars
                .filter(item => item.key.indexOf('_') !== 0)
                .map((item, index) => (
                  <Box key={index}>
                    <InputLabel>{item.label}</InputLabel>
                    <Input
                      value={templateValues[item.key] || ''}
                      onChange={e =>
                        setTemplateValues(prevState => ({
                          ...prevState,
                          [item.key]: e.target.value,
                        }))
                      }
                      {...(item.flags.includes('ml')
                        ? {
                            multiline: true,
                            maxRows: 6,
                          }
                        : {})}
                    />
                  </Box>
                ))}
            </Box>
          </Box>
        </>
      )}
    </MuiContainer>
  )
}

export default Template
