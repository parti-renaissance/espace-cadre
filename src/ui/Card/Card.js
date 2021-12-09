import PropTypes from 'prop-types'
import { Box, Paper } from '@mui/material'
import { styled } from '@mui/system'

export const RootContainer = styled(Paper)(
  ({ theme }) => `
  padding: ${theme.spacing(0, 2, 0, 2)};
  display: flex;
  flex-direction: column;
  borderRadius: 8.35px,
`
)

export const HeaderContainer = styled('div')`
  display: flex;
  flex-direction: column;
`

export const ContentContainer = styled('div')`
  display: flex;
  flex-direction: column;
`

const UICard = ({
  header,
  content,
  actions,
  rootProps = {},
  headerProps = {},
  contentProps = {},
  actionsProps = {},
}) => (
  <Box component={RootContainer} {...rootProps}>
    {header && (
      <Box component={HeaderContainer} {...headerProps}>
        {header}
      </Box>
    )}

    {content && (
      <Box component={ContentContainer} {...contentProps}>
        {content}
      </Box>
    )}

    {actions && <Box {...actionsProps}>{actions}</Box>}
  </Box>
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
