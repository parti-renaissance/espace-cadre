import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import Badge from '@mui/material/Badge'
import MarkunreadRoundedIcon from '@mui/icons-material/MarkunreadRounded'

interface Props {
  type: 'phone' | 'email'
  isSubscribed?: boolean
}

export default function SubscriptionBadge({ isSubscribed, type }: Props) {
  return (
    <Badge color={isSubscribed ? 'success' : 'error'} variant="dot" data-testid="badge-dot">
      {type === 'phone' && <PhoneRoundedIcon color="action" data-testid="phone-icon" />}
      {type === 'email' && <MarkunreadRoundedIcon color="action" data-testid="mail-icon" />}
    </Badge>
  )
}
