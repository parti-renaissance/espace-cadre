import PropTypes from 'prop-types'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/system'

const StyledCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
})

const StyledActions = styled('div')({
  display: 'flex',
  width: '100%',
  padding: '16px',
  paddingTop: '0',
  paddingBottom: '8px',
  justifyContent: 'space-between',
  flexDirection: 'column',
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
    {actions && <StyledActions {...actionsProps}>{actions}</StyledActions>}
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
