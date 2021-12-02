import PropTypes from 'prop-types'
import { Card, CardActions, CardContent, CardHeader } from '@mui/material'

const UICard = ({
  headerTitle,
  headerSubtitle,
  content,
  actions,
  rootProps = {},
  headerProps = {},
  contentProps = {},
  actionsProps = {},
}) => (
  <Card {...rootProps}>
    {headerTitle && <CardHeader {...headerProps} title={headerTitle} subheader={headerSubtitle} />}

    <CardContent sx={{ ...(contentProps.sx || {}), py: 0 }} {...contentProps}>
      {content}
    </CardContent>

    {actions && <CardActions {...actionsProps}>{actions}</CardActions>}
  </Card>
)

UICard.propTypes = {
  headerTitle: PropTypes.node,
  headerSubtitle: PropTypes.node,
  content: PropTypes.node,
  actions: PropTypes.node,
  rootProps: PropTypes.object,
  headerProps: PropTypes.object,
  contentProps: PropTypes.object,
  actionsProps: PropTypes.object,
}

export default UICard
