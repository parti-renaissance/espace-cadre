import { CardMedia } from '@mui/material'
import { ReactComponentElement } from 'react'
import placeholder from '~/assets/image/placeholder.png'

export default function EventImage({ image, ...props }: { image: string | ReactComponentElement<any> }) {
  if (typeof image === 'string') {
    return <CardMedia component="img" image={image} {...props} />
  }

  return <CardMedia component="img" image={placeholder} {...props} />
}
