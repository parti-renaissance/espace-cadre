import { InputAdornment } from '@mui/material'
import { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren<unknown> {
  position: 'start' | 'end'
}

export default function Adornment({ children, position }: Props) {
  return children ? <InputAdornment position={position}>{children}</InputAdornment> : undefined
}
