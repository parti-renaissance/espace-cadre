import { ProcurationModelWithPersonalInfos } from '~/api/Procuration/procuration.model'
import { Typography } from '@mui/material'
import { buildAddress } from '~/utils/address'
import { getFormattedDate } from '~/utils/date'

const buildExtraData = (item: ProcurationModelWithPersonalInfos) => [
  {
    key: 'Age',
    value: `${item.age} ans`,
  },
  {
    key: 'Mail',
    value: item.email ? (
      <a href={`mailto:${item.email}`}>
        <Typography fontSize={14}>{item.email}</Typography>
      </a>
    ) : (
      ''
    ),
  },
  {
    key: 'Téléphone',
    value: item.phone ? (
      <a href={`tel:${item.phone}`}>
        <Typography fontSize={14}>{item.phone}</Typography>
      </a>
    ) : (
      'Pas de téléphone'
    ),
  },
  {
    key: 'Adresse postale',
    value: buildAddress(item.post_address),
  },
  {
    key: 'Date d’inscription',
    value: getFormattedDate(item.created_at),
  },
]

export default buildExtraData
