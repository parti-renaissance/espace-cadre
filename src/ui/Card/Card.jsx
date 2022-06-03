import PropTypes from 'prop-types'
import { Paper } from '@mui/material'
import { styled } from '@mui/system'

import { VerticalContainer } from 'components/shared/styled'

export const Root = styled(Paper)(
  ({ theme }) => `
  padding: ${theme.spacing(0, 2, 2, 2)};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 8px;
  box-shadow: 0px 0px 5px rgba(29, 33, 79, 0.03);
  &:hover {
    box-shadow: 0px 4px 10px rgba(29, 33, 79, 0.06);
  }
`
)

const UICard = ({
  header,
  content,
  actions,
  rootProps = {},
  headerProps = {},
  contentProps = {},
  actionsProps = {},
}) => (
  <Root {...rootProps} data-cy="ui-card">
    {header && <VerticalContainer {...headerProps}>{header}</VerticalContainer>}
    {content && <VerticalContainer {...contentProps}>{content}</VerticalContainer>}
    {actions && <VerticalContainer {...actionsProps}>{actions}</VerticalContainer>}
  </Root>
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
