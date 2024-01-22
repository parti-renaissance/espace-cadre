import PropTypes from 'prop-types'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'

const UICard = ({
  header,
  content,
  actions,
  rootProps = {},
  headerProps = {},
  contentProps = {},
  actionsProps = {},
}) => (
  <Card {...rootProps} data-cy="ui-card">
    {header && <CardContent {...headerProps}>{header}</CardContent>}
    {content && <CardContent {...contentProps}>{content}</CardContent>}
    {actions && <CardActions {...actionsProps}>{actions}</CardActions>}
  </Card>
)

UICard.propTypes = {
  header: PropTypes.node,
  content: PropTypes.node,
  actions: PropTypes.node,
  rootProps: PropTypes.object,
  headerProps: PropTypes.object,
  contentProps: PropTypes.object,
  actionsProps: PropTypes.object,
}

export default UICard
