import { Card, CardContent, Box, TextField, Stack, Typography, Button, Dialog } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Iconify from '~/mui/iconify'
import { grey } from '~/theme/palette'
import { useNavigate, useParams, useSearchParams, useBlocker } from 'react-router-dom'
import { paths } from '~/components/Messagerie/shared/paths'
import ManageLayout from '~/components/Messagerie/pages/manage/Layout'
import { useForm } from 'react-hook-form'
import Message, { MessageContent } from '~/domain/message'
import { useScopedQueryKey } from '~/api/useQueryWithScope'
import { useQuery, useQueryClient, useMutation, UseMutationResult } from '@tanstack/react-query'
import { getMessage, updateMessageContent } from '~/api/messagerie'
import ModalSaveBeforeLeave from '~/components/Messagerie/Component/ModalSaveBeforeLeave'
import { useState } from 'react'

const sidebarProps = {
  title: 'Editeur',
  helpers: [
    {
      title: 'Nom',
      content:
        'Le nom de l’email reste sur l’espace cadre et n’a pour fonction que de vous permette d’identifier rapidement une précédente campagne.',
    },
    {
      title: 'Objet',
      content:
        'Il doit inciter à l’ouverture de votre email. Pour celà, soyez percutant en moins de 9 mots de préférence. Un émoji peut rendre votre objet plus visible mais n’en abusez pas au risque d’augmenter les taux de spams.',
    },
    {
      title: 'Contenu',
      content:
        'Allez droit au but. Les mails longs ne sont pas lus et provoquent des désabonnements parmi votre audience. Privilégiez les emails ne comportant qu’une seule information et une seule action. Par exemple : annonce d’un événement à venir et bouton d’inscription. Si vous avez plusieurs annonces importantes à faire, peut-être serait-il plus judicieux de faire plusieurs emails espacés de plusieurs jours.',
    },
  ],
}

type Inputs = {
  label: string
  subject: string
}

const Form = ({
  data,
  setData,
  mutate,
}: {
  data?: Message
  setData: (x: Message) => void
  mutate: UseMutationResult<MessageContent, unknown, { id: string; x: Partial<Message> }, unknown>
}) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register, handleSubmit, getValues, reset, formState } = useForm<Inputs>({
    defaultValues: {
      label: data?.label || '',
      subject: data?.subject || '',
    },
  })

  const [blockerOpen, setBlockerOpen] = useState(false)

  const handleCloseBlockerModal = () => {
    setBlockerOpen(false)
  }

  const blocker = useBlocker(({ nextLocation }) => {
    if (
      formState.isDirty &&
      data?.id &&
      !nextLocation.pathname.startsWith(`/messagerie/${paths.update}/newsletter/${data.id}/${paths.unlayer}`)
    ) {
      setBlockerOpen(true)
      return true
    }
    return false
  })

  const onSubmit = (action: 'save' | 'next') => async (payload: Inputs) => {
    if (!data || !data.id) {
      return
    }
    await mutate.mutateAsync({ id: data?.id, x: { ...data, ...payload } })
    reset(payload)
    if (action === 'next') {
      setTimeout(() => {
        navigate(`/messagerie/${paths.update}/newsletter/${data.id}/${paths.preview}`)
      }, 0)
    }
  }

  const handleSave = () => {
    setBlockerOpen(false)
    return onSubmit('save')(getValues())
  }

  const handleOpenEditor = () => {
    const formData = getValues()
    setData({ ...data, ...formData } as Message)
    const templateId = searchParams.get('templateId')
    const path = templateId ? `${paths.unlayer}?templateId=${templateId}` : paths.unlayer
    navigate(path)
  }
  return (
    <ManageLayout {...sidebarProps}>
      <Stack spacing={4} direction="column" justifyContent="space-between">
        <Card>
          <CardContent>
            <Stack spacing={4} marginTop={2} direction={'column'}>
              <TextField id="message-name" label="Nom" rows={4} variant="outlined" {...register('label')} />
              <TextField id="mail-object" label="Objet" rows={4} variant="outlined" {...register('subject')} />
              <Box
                sx={{ cursor: 'pointer' }}
                onClick={handleOpenEditor}
                data-cy="unlayer-btn"
                bgcolor={grey[100]}
                borderRadius={2}
                height={112}
              >
                <Stack alignItems="center" justifyContent="center" height="100%">
                  <Iconify icon="mdi:external-link" color={grey[600]} width={40} height={40} />
                  <Typography color={grey[600]} variant="h6">
                    Ouvir l&apos;éditeur
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <Stack spacing={2} direction="row" justifyContent="flex-end">
          <LoadingButton
            loading={mutate.isLoading}
            disabled={!data?.id || !formState.isDirty}
            variant="outlined"
            onClick={handleSubmit(onSubmit('save'))}
          >
            {'Enregistrer le brouillion'}
          </LoadingButton>
          <LoadingButton
            loading={mutate.isLoading}
            disabled={!data?.id}
            variant="contained"
            onClick={handleSubmit(onSubmit('next'))}
            data-cy="step-button"
          >
            {data?.id && formState.isDirty ? "Enregistrer et voir l'Aperçu" : "Voir l'Aperçu"}
          </LoadingButton>
        </Stack>
      </Stack>
      <ModalSaveBeforeLeave
        open={blockerOpen}
        onClose={handleCloseBlockerModal}
        onSave={handleSave}
        blocker={blocker}
      />
    </ManageLayout>
  )
}

export default function NewsletterEditorPage() {
  const { id } = useParams<{ id: string }>()
  const queryKey = useScopedQueryKey(['message', { feature: 'Messagerie', view: 'TemplateEditor', id }])
  const queryClient = useQueryClient()

  const mutate = useMutation({
    mutationFn: (x: { id: string; x: Partial<MessageContent> }) =>
      (updateMessageContent as (id: string, x: Partial<MessageContent>) => Promise<MessageContent>)(x.id, x.x),
    onSuccess: data => {
      queryClient.invalidateQueries(queryKey)
      queryClient.setQueryData(queryKey, data)
    },
  })

  const { data = undefined } = useQuery(queryKey, (() => getMessage(id!)) as () => Promise<Message>, {
    enabled: !!id,
    initialData: (() =>
      !id
        ? {
            label: '',
            subject: '',
          }
        : undefined) as () => Message | undefined,
  })

  if (!data) {
    return null
  }

  return <Form data={data} mutate={mutate} setData={m => queryClient.setQueryData(queryKey, () => m)} />
}
