import { Skeleton } from '@mui/material'
import { MuiThemeableModel } from '~/models/muiThemeableModel'

export default function SkeletonLine({ sx }: MuiThemeableModel) {
  return <Skeleton width={'100%'} height={50} sx={sx} />
}
