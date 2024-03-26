import { Skeleton } from '@mui/material'
import { MuiThemeableModel } from '~/models/muiThemeableModel'

interface Props extends MuiThemeableModel {
  height?: number
}

export default function SkeletonCard({ height, sx }: Props) {
  return <Skeleton width={'100%'} height={height ?? 300} sx={sx} />
}
