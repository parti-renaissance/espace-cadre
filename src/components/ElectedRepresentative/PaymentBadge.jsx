import PropTypes from 'prop-types'
import { UIChip } from 'ui/Card'
import { paymentStatus } from './constants'

const PaymentBadge = ({ status, ...props }) => {
  let defaultProperties = {
    label: typeof paymentStatus[status] !== 'undefined' ? paymentStatus[status] : 'Status inconnu',
    color: 'colors.gray.800',
    bgcolor: 'colors.gray.100',
  }
  let properties = defaultProperties

  if ([paymentStatus.cheque_received, paymentStatus.confirmed].includes(paymentStatus[status])) {
    properties = Object.assign(defaultProperties, {
      label: paymentStatus[status],
      color: 'teal700',
      bgcolor: 'activeLabel',
    })
  }

  if (
    [
      paymentStatus.cancelled,
      paymentStatus.failed,
      paymentStatus.cheque_rejected,
      paymentStatus.customer_approval_denied,
    ].includes(paymentStatus[status])
  ) {
    properties = Object.assign(defaultProperties, {
      label: paymentStatus[status],
      color: 'red600',
      bgcolor: 'inactiveLabel',
    })
  }

  if (
    [paymentStatus.pending_submission, paymentStatus.submitted, paymentStatus.pending_customer_approval].includes(
      paymentStatus[status]
    )
  ) {
    properties = Object.assign(defaultProperties, {
      label: paymentStatus[status],
      color: 'yellow800',
      bgcolor: 'pendingLabel',
    })
  }

  return <UIChip {...properties} {...props} />
}

export default PaymentBadge

PaymentBadge.propTypes = {
  status: PropTypes.string,
}
