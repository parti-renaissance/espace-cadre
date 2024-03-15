import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import Badge from '@mui/material/Badge'
import MarkunreadRoundedIcon from '@mui/icons-material/MarkunreadRounded'

interface Props {
  type: 'phone' | 'email'
  isSubscribed?: boolean
  disabledOpacity?: number
  enabledOpacity?: number
}

export default function SubscriptionBadge({ isSubscribed, type, disabledOpacity = 0.8, enabledOpacity = 1 }: Props) {
  return (
    <Badge color={isSubscribed ? 'success' : 'error'} variant="dot" data-testid="badge-dot">
      {type === 'phone' && (
        <PhoneRoundedIcon
          color="action"
          data-testid="phone-icon"
          style={{ opacity: !isSubscribed ? disabledOpacity : enabledOpacity }}
        />
      )}
      {type === 'email' && (
        <MarkunreadRoundedIcon
          color="action"
          data-testid="mail-icon"
          style={{ opacity: !isSubscribed ? disabledOpacity : enabledOpacity }}
        />
      )}
    </Badge>
  )
}
