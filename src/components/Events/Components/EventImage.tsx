import { CardMedia, CardMediaProps } from '@mui/material'
import placeholder from '~/assets/image/placeholder.png'

export default function EventImage({ image, ...props }: CardMediaProps & { image: string | null }) {
  if (image) {
    return <CardMedia component="img" image={image} {...props} />
  }

  return <CardMedia component="img" image={placeholder} {...props} />
}
