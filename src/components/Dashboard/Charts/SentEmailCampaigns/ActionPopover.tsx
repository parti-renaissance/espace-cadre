import { Box, Typography, MenuList, MenuItem, Divider } from '@mui/material'
import CustomPopover, { usePopover } from '~/mui/custom-popover'
import { MutableRefObject } from 'react'
import { Message } from '~/domain/message'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { notifyVariants } from '~/components/shared/notification/constants'
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteMessage } from '~/api/messagerie'
import { useScopedQueryKey } from '~/api/useQueryWithScope'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { paths as messageriePaths } from '~/components/Messagerie/shared/paths'
import { generatePath, useNavigate } from 'react-router-dom'

interface ActionsProps {
  popover: ReturnType<typeof usePopover>
  isMailsStatutory: boolean
  message: MutableRefObject<Message | null>
}

const messages = {
  noCampaign: 'Aucune campagne à afficher',
  noStatutoryMail: 'Aucun mail statutaire à afficher',
  deleteSuccess: 'Brouillon supprimé avec succès',
}

type PaginatedCampaingns = InfiniteData<{ data: Message[] }>

const Actions = ({ popover, isMailsStatutory, message }: ActionsProps) => {
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()
  const queryClient = useQueryClient()
  const queryKey = useScopedQueryKey(['paginated-campaigns', { feature: 'Dashboard', view: 'SentEmailCampaigns' }])
  const navigate = useNavigate()

  const canEdit = !isMailsStatutory && message.current?.draft
  const canPreview = message.current?.isSynchronized && message.current?.previewLink
  const canDuplicate = message.current?.draft
  const canDelete = canEdit

  const { mutateAsync: deleteDraft } = useMutation(deleteMessage, {
    onMutate: async draftId => {
      await queryClient.cancelQueries(queryKey)
      const previousCampains = queryClient.getQueryData<PaginatedCampaingns>(queryKey)
      if (previousCampains) {
        queryClient.setQueryData<PaginatedCampaingns>(queryKey, {
          pageParams: previousCampains.pageParams,
          pages: previousCampains.pages.map(page => ({
            data: page.data.filter(message => message.id !== draftId),
          })),
        })
      }
      return { previousCampains }
    },
    onSuccess: () => {
      enqueueSnackbar(messages.deleteSuccess, notifyVariants.success)
    },
    onError: (err, _, context) => {
      handleError(err)
      if (!context?.previousCampains) {
        return
      }
      queryClient.setQueryData<PaginatedCampaingns>(queryKey, context.previousCampains)
    },
  })

  const eitherMessage = (cb: (x: Message) => void, error = 'Une erreur est survenue') => {
    if (message.current === null) {
      enqueueSnackbar(error, notifyVariants.error)
      return
    }
    cb(message.current)
    popover.onClose()
  }

  const onDelete = () => eitherMessage(x => deleteDraft(x.id))
  const onPreview = () => eitherMessage(x => window.open(x.previewLink))
  const onEdit = () =>
    eitherMessage(x => navigate(generatePath(`${messageriePaths.update}/newsletter/:messageId/`, { messageId: x.id })))
  const onDuplicate = () =>
    eitherMessage(() => {
      throw new Error('not implemented')
    }, 'not implemented')

  return (
    <Box sx={{ width: '100%', minWidth: 200, maxWidth: 360, bgcolor: 'background.paper' }}>
      <MenuList>
        {canPreview && <MenuItem onClick={onPreview}>Aperçu</MenuItem>}
        {canDuplicate && <MenuItem onClick={onDuplicate}>Dupliquer</MenuItem>}
        {canEdit && <MenuItem onClick={onEdit}>Editer</MenuItem>}
        {canDelete && <Divider />}
        {canDelete && (
          <MenuItem onClick={onDelete}>
            <Typography color="error">Supprimer</Typography>
          </MenuItem>
        )}
      </MenuList>
    </Box>
  )
}

const popoverStaticProps = {
  anchorOrigin: { vertical: 'center', horizontal: 'right' },
  transformOrigin: { vertical: 'center', horizontal: 'left' },
  arrow: 'left-center',
} as const

const ActionPopover = (props: ActionsProps) => {
  const { open, onClose } = props.popover
  return (
    <CustomPopover open={open} onClose={onClose} {...popoverStaticProps}>
      <Actions {...props} />
    </CustomPopover>
  )
}

export default ActionPopover
