import { Box, Typography, MenuList, MenuItem } from '@mui/material'
import CustomPopover, { usePopover } from '~/mui/custom-popover'
import { Event } from '~/components/Events/shared/types'
import { EventAction } from '~/components/Events/pages/list/components/CardEvent/CardEvent'

type ActionButton = {
  label: string
  canShow: boolean
  onClick: (event: Event) => void
}

const Actions = ({ event, onClick }: ActionsProps) => {
  const actionsButtons: ActionButton[] = [
    {
      label: "Voir l'événement",
      canShow: true,
      onClick: () => onClick('detail'),
    },
    {
      label: 'Modifier',
      canShow: !!event.scheduled,
      onClick: () => onClick('edit'),
    },
    {
      label: 'Annuler',
      canShow: !!event.scheduled,
      onClick: () => onClick('cancel'),
    },
    {
      label: 'Supprimer',
      canShow: event.attendees <= 1,
      onClick: () => onClick('delete'),
    },
  ]

  return (
    <Box sx={{ width: '100%', minWidth: 200, maxWidth: 360, bgcolor: 'background.paper' }}>
      <MenuList>
        {actionsButtons.map((action, index) => (
          <MenuItem
            key={index}
            sx={{ cursor: action.canShow ? 'pointer' : 'not-allowed' }}
            onClick={() => {
              if (action.canShow) {
                action.onClick(event)
              }
            }}
          >
            <Typography color={action.canShow ? 'text.primary' : 'text.secondary'}>{action.label}</Typography>
          </MenuItem>
        ))}
      </MenuList>
    </Box>
  )
}

const popoverStaticProps = {
  anchorOrigin: { vertical: 'center', horizontal: 'right' },
  transformOrigin: { vertical: 'center', horizontal: 'left' },
  arrow: 'left-center',
} as const

interface ActionsProps {
  popover: ReturnType<typeof usePopover>
  event: Event
  onClick: (event: Event, action: EventAction) => void
}

export const ActionPopover = (props: ActionsProps) => {
  const { open, onClose } = props.popover

  return (
    <CustomPopover open={open} onClose={onClose} {...popoverStaticProps}>
      <Actions {...props} />
    </CustomPopover>
  )
}

export default ActionPopover
