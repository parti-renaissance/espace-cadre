import { useMemo } from 'react'
import { Event } from '~/components/Events/shared/types'
import Label, { LabelColor } from '~/mui/label'
import * as React from 'react'

const getStatusFromEvent = (event: Event) => {
  const listStatus = {
    passed: {
      enable: event.finishAt && new Date(event?.finishAt) < new Date(),
      label: 'Passé',
      color: 'default',
    },
    inProgresss: {
      enable:
        event.beginAt &&
        event.finishAt &&
        new Date(event.beginAt) < new Date() &&
        new Date(event.finishAt) > new Date(),
      label: 'En cours',
      color: 'success',
    },
    upcoming: {
      enable: event.beginAt && new Date(event.beginAt) > new Date() && event.scheduled,
      label: 'À venir',
      color: 'info',
    },
    canceled: {
      enable: event.finishAt && new Date(event.finishAt) < new Date() && !event.scheduled,
      label: 'Annulé',
      color: 'error',
    },
  }

  return Object.values(listStatus).find(s => s.enable)
}

type BadgeStatusProps = {
  event: Event
}

const BadgeStatus = ({ event }: BadgeStatusProps) => {
  const status = useMemo(() => getStatusFromEvent(event), [event])

  return (
    <Label
      color={status?.color as LabelColor}
      data-cy="badge-status"
      variant="soft"
      sx={{
        fontWeight: 600,
      }}
    >
      {status?.label}
    </Label>
  )
}

export default BadgeStatus
