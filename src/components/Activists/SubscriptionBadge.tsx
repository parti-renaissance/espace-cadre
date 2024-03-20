import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import Badge from '@mui/material/Badge'
import MarkunreadRoundedIcon from '@mui/icons-material/MarkunreadRounded'
import { Tooltip } from '@mui/material'
import { sprintf } from 'sprintf-js'

interface Props {
  type: 'phone' | 'email'
  isSubscribed?: boolean
  isEligible?: boolean
  notEligibleOpacity?: number
  disabledOpacity?: number
  enabledOpacity?: number
}

export default function SubscriptionBadge({
  isSubscribed,
  type,
  isEligible = true,
  disabledOpacity = 0.8,
  enabledOpacity = 1,
  notEligibleOpacity = 0.5,
}: Props) {
  const color = isEligible ? (isSubscribed ? 'success' : 'error') : 'default'
  const notEligibleSentence = type === 'phone' ? 'Pas de téléphone.' : 'Pas d’email.'
  const eligibleSentence = sprintf(
    '%s aux communications par %s.',
    isSubscribed ? 'Abonné' : 'Désabonné',
    type === 'phone' ? 'téléphone' : 'email'
  )

  return (
    <Tooltip title={isEligible ? eligibleSentence : notEligibleSentence}>
      <Badge
        color={color}
        variant="dot"
        data-testid="badge-dot"
        style={{ opacity: isEligible ? 1 : notEligibleOpacity }}
      >
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
    </Tooltip>
  )
}
