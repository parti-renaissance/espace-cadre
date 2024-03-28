import { Typography } from '@mui/material'
import { fontWeight } from '~/theme/typography'
import { memo } from 'react'

function ProxyDoneIntroduction() {
  return (
    <div style={{ position: 'sticky', top: 80 }}>
      <p>
        <Typography fontWeight={fontWeight.medium} color={'text.secondary'}>
          Mandataires traités
        </Typography>
        <br />
        <Typography color={'text.secondary'} fontSize={14}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus accusantium aut culpa dolor eum facere
          fuga in, itaque molestias nam necessitatibus nulla perferendis provident quos repellat, suscipit unde vitae
          voluptas.
        </Typography>
      </p>

      <p>
        <Typography color={'text.secondary'} fontSize={14}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus accusantium aut culpa dolor eum facere
          fuga in, itaque molestias nam necessitatibus nulla perferendis provident quos repellat, suscipit unde vitae
          voluptas.
        </Typography>
      </p>
    </div>
  )
}

export default memo(ProxyDoneIntroduction)
