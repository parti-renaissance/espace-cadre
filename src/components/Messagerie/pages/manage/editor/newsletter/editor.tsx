import * as Sentry from '@sentry/react'
import PropTypes from 'prop-types'
import { useEffect, useState, useMemo } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box } from '@mui/material'
import { Stack } from '@mui/system'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getMessageContent, getTemplate } from '~/api/messagerie'
import { postUpdateNewsletter } from './utils'
import { useScopedQueryKey } from '~/api/useQueryWithScope'
import { useErrorHandler } from '~/components/shared/error/hooks'
import Editor, { EditorProps } from '~/components/Messagerie/Component/Editor'
import { notifyVariants, notifyMessages } from '~/components/shared/notification/constants'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { paths as messageriePaths } from '~/components/Messagerie/shared/paths'
import useDrawerStore from '~/stores/drawerStore'
import Message, { MessageContent } from '~/domain/message'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useUserScope } from '~/redux/user/hooks'
import { defaultUnlayerTemplateId, unlayerTemplateIds, templateByType } from '~/shared/unlayerTemplateIds'

import { PrefillTemplateDetails, usePrefillTemplate, useGetPrefillDetails } from '~/hooks/use-prefill-template'

const clearBody = (body: string) => body.substring(body.indexOf('<table'), body.lastIndexOf('</table>') + 8)

type PayloadFetchMessageContent = {
  messageId?: string | null
  templateId?: string | null
} & PrefillTemplateDetails

const getTemplateIdByType = (type: string) => {
  const template = templateByType[type]
  if (!template) {
    throw new Error(`No template found for type ${type}`)
  }
  return template
}

const getMessageContentQuery = ({
  messageId,
  templateId,
  type,
  dataId,
}: PayloadFetchMessageContent): (() => Promise<MessageContent>) => {
  if (messageId) {
    return () => getMessageContent(messageId)
  }

  if (templateId) {
    return () => getTemplate(templateId)
  }

  if (type && dataId) {
    return () => getTemplate(getTemplateIdByType(type))
  }
  return () => Promise.reject(new Error('No messageId, templateId or type and dataId found'))
}

const messages = {
  title: 'Messagerie',
  titleSuffix: 'Créer un message',
  createSuccess: 'Message créé avec succès',
  updateSuccess: 'Message modifié avec succès',
}

const Template = () => {
  const [currentScope] = useUserScope()
  const { handleError } = useErrorHandler()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isUpdate = id === 'creer'
  const [messageUuid, setMessageUuid] = useState<string | undefined>(isUpdate ? undefined : id)
  const [searchParams] = useSearchParams()
  const templateId = searchParams.get('templateId')
  const { detail: prefilledDetail, isPrefilledTemplate } = useGetPrefillDetails()

  const { enqueueSnackbar } = useCustomSnackbar()
  const { setFullscreen } = useDrawerStore()
  const [editorData, setEditorData] = useState<{
    content: string
    json_content: string
  }>({ content: '', json_content: '' })
  const queryClient = useQueryClient()
  const queryKeyMessageContent = useScopedQueryKey([
    'message-content-template',
    { feature: 'Messagerie', view: 'TemplateEditor', templateId, messageUuid },
  ])

  const unlayerTemplateId = useMemo(
    () => (currentScope ? unlayerTemplateIds[currentScope.getMainCode()] : defaultUnlayerTemplateId),
    [currentScope]
  )

  const queryKeyMessage = useScopedQueryKey(['message', { feature: 'Messagerie', view: 'TemplateEditor', id }])
  const dataMessage = queryClient.getQueryData<Message>(queryKeyMessage)

  const { data: messageContent, isLoading } = useQuery({
    queryKey: queryKeyMessageContent,
    queryFn: getMessageContentQuery({
      messageId: messageUuid,
      templateId,
      ...prefilledDetail,
    }),
    enabled: Boolean(messageUuid || templateId || isPrefilledTemplate),
    onError: handleError,
  })

  const {
    data: processeedMessageContent,
    isParsingNeeded,
    isProccessed,
  } = usePrefillTemplate(messageContent, prefilledDetail)

  const { mutateAsync: postUpdateNewsletterMutation, isLoading: loading } = useMutation({
    mutationFn: postUpdateNewsletter,
    onError: handleError,
    onSuccess: ({ uuid }) => {
      queryClient.invalidateQueries(queryKeyMessageContent)
      setMessageUuid(uuid)
    },
  })

  const handleSetMessage = (message: Parameters<NonNullable<EditorProps['onMessageUpdate']>>[0]) => {
    setEditorData({
      content: clearBody(message.chunks.body),
      json_content: JSON.stringify(message.design),
    })
  }

  useEffect(() => {
    setFullscreen(true)
    return () => {
      setFullscreen(false)
    }
  }, [setFullscreen])

  const handleClickNext = (redirect: 'leave' | 'next') => () => {
    if (redirect === 'leave' && !editorData?.content) {
      if (messageUuid) {
        navigate(`/messagerie/${messageriePaths.update}/newsletter/${messageUuid}`)
      } else {
        navigate(`/messagerie/${messageriePaths.create}/newsletter`)
      }
      return
    }

    if (redirect === 'next' && !editorData?.content) {
      if (messageUuid) {
        navigate(`/messagerie/${messageriePaths.update}/newsletter/${messageUuid}/${messageriePaths.preview}`)
      } else {
        enqueueSnackbar('Veuillez écrire un message', notifyVariants.error)
      }
      return
    }
    try {
      const bodyPayload = {
        uuid: messageUuid,
        type: currentScope.getMainCode(),
        label: dataMessage?.label || messageContent?.label || 'Sans titre',
        subject: dataMessage?.subject || messageContent?.label || 'Sans objet',
        ...editorData,
      }
      postUpdateNewsletterMutation(bodyPayload).then(body => {
        enqueueSnackbar(messageUuid ? messages.updateSuccess : messages.createSuccess, notifyVariants.success)
        if (redirect === 'next') {
          navigate(`/messagerie/${messageriePaths.update}/newsletter/${body.uuid}/${messageriePaths.preview}`)
        } else {
          navigate(`/messagerie/${messageriePaths.update}/newsletter/${body.uuid}`)
        }
      })
    } catch (e) {
      Sentry.captureException(e)
      enqueueSnackbar(notifyMessages.errorTitle, notifyVariants.error)
    }
  }

  const showEditor = (() => {
    if (messageUuid || templateId) {
      return !isLoading && processeedMessageContent
    }

    if (isParsingNeeded) {
      return isProccessed && processeedMessageContent
    }

    return true
  })()

  return (
    <>
      <Stack spacing={4} padding={1} bgcolor="white">
        <Box alignSelf="flex-end">
          <Stack spacing={2} direction="row">
            <LoadingButton loading={loading} variant="contained" disabled={loading} onClick={handleClickNext('leave')}>
              {editorData?.content ? 'Enregister et' : ''} fermer
            </LoadingButton>
            <LoadingButton
              loading={loading}
              variant="outlined"
              disabled={loading || !editorData?.content}
              onClick={handleClickNext('next')}
            >
              {editorData?.content ? 'Enregister et' : ''} apercevoir
            </LoadingButton>
          </Stack>
        </Box>
      </Stack>
      {showEditor && (
        <Editor
          templateId={unlayerTemplateId}
          onMessageUpdate={handleSetMessage}
          messageContent={processeedMessageContent}
          key={messageContent?.uuid}
        />
      )}
    </>
  )
}

export default Template

Template.propTypes = {
  modeUpdate: PropTypes.bool,
}
