import { useMemo } from 'react'
import Label, { LabelColor } from '~/mui/label'

type BadgeStatusProps = {
  beginAt: Date
  finishAt: Date
  scheduled: boolean
}

const BadgeStatus = (props: BadgeStatusProps) => {
  const { beginAt, finishAt, scheduled } = props

  const status = useMemo(() => {
    const listStatus = {
      passed: {
        enable: scheduled && finishAt && new Date(finishAt) < new Date(),
        label: 'Passé',
        color: 'default',
      },
      inProgress: {
        enable: beginAt && finishAt && new Date(beginAt) < new Date() && new Date(finishAt) > new Date(),
        label: 'En cours',
        color: 'success',
      },
      upcoming: {
        enable: scheduled,
        label: 'À venir',
        color: 'info',
      },
      canceled: {
        enable: !scheduled,
        label: 'Annulé',
        color: 'error',
      },
    }

    for (const key in listStatus) {
      if (listStatus[key].enable) {
        return listStatus[key]
      }
    }
  }, [beginAt, finishAt, scheduled])

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
