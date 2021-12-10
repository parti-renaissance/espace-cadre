import PropTypes from 'prop-types'
import { Paper } from '@mui/material'
import { styled } from '@mui/system'

import { VerticalContainer } from 'components/shared/styled'

export const Root = styled(Paper)(
  ({ theme }) => `
  padding: ${theme.spacing(0, 2, 0, 2)};
  display: flex;
  flex-direction: column;
  borderRadius: 8.35px;
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
  <Root {...rootProps}>
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
