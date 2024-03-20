import { ActivistModel, ZoneEnum } from '~/models/activist.model'
import { Tooltip, Typography } from '@mui/material'
import { fontWeight } from '~/theme/typography'
import { zoneLabels } from '~/domain/zone'

export default function ActivistZoneCell(line: ActivistModel) {
  const ZoneLine = ({
    zone,
    tooltip,
    color,
    bold = false,
  }: {
    zone?: string | null
    tooltip?: string
    color?: string
    bold?: boolean
  }) =>
    zone ? (
      <div>
        <Tooltip title={tooltip} color={color} placement="right">
          <Typography variant="body2" fontWeight={bold ? fontWeight.medium : fontWeight.regular}>
            {zone}
          </Typography>
        </Tooltip>
      </div>
    ) : (
      <></>
    )

  return (
    <>
      {line.zones
        .filter(el => el.type !== ZoneEnum.CANTON)
        .map(zone => (
          <ZoneLine key={zone.uuid} zone={zone.name} tooltip={zoneLabels[zone.type]} bold />
        ))}
      <ZoneLine zone={line.committee} tooltip={'Comité'} />
    </>
  )
}
