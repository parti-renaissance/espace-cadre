import PropTypes from 'prop-types'
import { Card as MuiCard, CardContent } from '@mui/material'
import { styled } from '@mui/system'

const StyledCard = styled(MuiCard)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  border: '1px solid #eee',
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
    {content && (
      <CardContent
        sx={
          header
            ? {
                pt: '0',
              }
            : {}
        }
        {...contentProps}
      >
        {content}
      </CardContent>
    )}
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
