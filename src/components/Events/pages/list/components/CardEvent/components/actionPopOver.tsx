import React from 'react'
import { Box, Typography, MenuList, MenuItem } from '@mui/material'
import CustomPopover, { usePopover } from '~/mui/custom-popover'
import { Event } from '~/components/Events/shared/types'
import { CardEventAction } from '~/components/Events/pages/list/components/CardEvent/CardEvent'

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
      onClick: event => onClick(event, 'detail'),
    },
    {
      label: 'Modifier',
      canShow: true,
      onClick: event => onClick(event, 'edit'),
    },
    {
      label: 'Annulé',
      canShow: true,
      onClick: event => onClick(event, 'cancel'),
    },
    {
      label: 'Supprimer',
      canShow: true,
      onClick: event => onClick(event, 'delete'),
    },
  ]

  return (
    <Box sx={{ width: '100%', minWidth: 200, maxWidth: 360, bgcolor: 'background.paper' }}>
      <MenuList>
        {actionsButtons.map((action, index) => {
          return (
            <MenuItem
              key={index}
              onClick={() => {
                action.onClick(event)
              }}
            >
              <Typography>{action.label}</Typography>
            </MenuItem>
          )
        })}
      </MenuList>
    </Box>
  )
}

const popoverStaticProps = {
  anchorOrigin: { vertical: 'center', horizontal: 'right' },
  transformOrigin: { vertical: 'center', horizontal: 'left' },
  arrow: 'left-center',
} as const

// ------------------ ActionPopover ------------------

interface ActionsProps {
  popover: ReturnType<typeof usePopover>
  event: Event
  onClick: (event: Event, action: CardEventAction) => void
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
