import { forwardRef, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { SnackbarContent } from 'notistack'
import { Card, CardActions as MuiCardActions, Collapse, Grid, IconButton, Paper, Typography } from '@mui/material'
import { styled } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { shouldForwardProps } from '~/components/shared/shouldForwardProps'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'

const Wrapper = styled(SnackbarContent)`
  min-width: 300px;
  max-width: 400px;
  display: flex;
`
const CardActions = styled(MuiCardActions)(
  ({ theme, variant }) => `
  padding: ${theme.spacing(1, 1, 1, 2)};
  justify-content: space-between;
  background: ${theme.palette.notification[variant].background};
  color: ${theme.palette.whiteCorner};
`
)
const Title = styled(props => <Typography variant="body2" {...props} />, shouldForwardProps)`
  padding: ${({ theme }) => theme.spacing(0, 3, 0, 1)};
`
const ExpandButton = styled(
  IconButton,
  shouldForwardProps
)(
  ({ theme, expanded }) => `
transform: rotate(${expanded ? 180 : 0}deg);
transition: ${theme.transitions.create('transform', { duration: theme.transitions.duration.shortest })};
`
)

const ColoredExpandIcon = styled(ExpandMoreIcon)`
  color: ${({ theme }) => theme.palette.whiteCorner};
`
const ColoredCloseIcon = styled(CloseIcon)`
  color: ${({ theme }) => theme.palette.whiteCorner};
`
const Content = styled(
  Paper,
  shouldForwardProps
)(
  ({ theme, bold }) => `
  padding: ${theme.spacing(2, 2, 2, 3)};
  background: ${theme.palette.whiteCorner};
  color: ${theme.palette.blackCorner};
  border: 1px solid ${theme.palette.gray300};
  font-weight: ${bold === true ? 600 : 'initial'};
  font-size: 14px;
`
)

const UISnackBar = forwardRef(({ id, message, variant, dismissResolve, children }, ref) => {
  const [expanded, setExpanded] = useState(false)
  const { closeSnackbar } = useCustomSnackbar()

  const handleExpandToggle = useCallback(() => {
    setExpanded(currentExpanded => !currentExpanded)
  }, [])

  const handleDismiss = useCallback(() => {
    closeSnackbar(id)
    dismissResolve && dismissResolve()
  }, [id, closeSnackbar, dismissResolve])

  return (
    <Wrapper ref={ref}>
      <Card>
        <CardActions variant={variant}>
          <Grid item>
            <Title>{message}</Title>
          </Grid>
          <Grid item>
            {children && (
              <ExpandButton expanded={expanded} onClick={handleExpandToggle}>
                <ColoredExpandIcon fontSize="small" />
              </ExpandButton>
            )}
            <IconButton onClick={handleDismiss}>
              <ColoredCloseIcon fontSize="small" />
            </IconButton>
          </Grid>
        </CardActions>
        {children && (
          <Collapse in={expanded} timeout="auto">
            <Content bold>{children}</Content>
          </Collapse>
        )}
      </Card>
    </Wrapper>
  )
})

UISnackBar.displayName = 'UISnackBar'
UISnackBar.defaultProps = {
  content: null,
  dismissResolve: null,
  children: null,
}
UISnackBar.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  children: PropTypes.node,
  dismissResolve: PropTypes.func,
}

export default UISnackBar
