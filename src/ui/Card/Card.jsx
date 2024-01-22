import PropTypes from 'prop-types'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/system'

const StyledCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
})

const UICard = ({
  header,
  content,
  actions,
  rootProps = {},
  headerProps = {},
  contentProps = {},
  actionsProps = {},
}) => (
  <StyledCard {...rootProps} data-cy="ui-card">
    {header && <CardContent {...headerProps}>{header}</CardContent>}
    {content && <CardContent {...contentProps}>{content}</CardContent>}
    {actions && <CardActions {...actionsProps}>{actions}</CardActions>}
  </StyledCard>
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
