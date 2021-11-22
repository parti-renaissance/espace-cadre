import { forwardRef, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { SnackbarContent } from 'notistack'
import { Card, CardActions as MuiCardActions, Collapse, Grid, IconButton, Paper, Typography } from '@mui/material'
import { styled } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { shouldForwardProps } from '../../theme'
import { useCustomSnackbar } from 'components/shared/notification/hooks'

const Wrapper = styled(SnackbarContent)`
  min-width: 300px;
  max-width: 345px;
  display: flex;
`
const CardActions = styled(MuiCardActions)`
  padding: ${({ theme }) => theme.spacing(1, 1, 1, 2)};
  justify-content: space-between;
  background: ${({ theme, variant }) => theme.palette.notification[variant].background};
  color: ${({ theme }) => theme.palette.whiteCorner};
`
const Title = styled(props => <Typography variant="body2" {...props} />, shouldForwardProps)`
  padding: ${({ theme }) => theme.spacing(0, 3, 0, 1)};
`
const ExpandButton = styled(IconButton, shouldForwardProps)`
  transform: rotate(${({ expanded }) => (expanded ? 180 : 0)}deg);
  transition: ${({ theme }) =>
    theme.transitions.create('transform', { duration: theme.transitions.duration.shortest })};
`
const ColoredExpandIcon = styled(ExpandMoreIcon)`
  color: ${({ theme }) => theme.palette.whiteCorner};
`
const ColoredCloseIcon = styled(CloseIcon)`
  color: ${({ theme }) => theme.palette.whiteCorner};
`
const Content = styled(Paper, shouldForwardProps)`
  padding: ${({ theme }) => theme.spacing(2, 2, 2, 3)};
  background: ${({ theme }) => theme.palette.whiteCorner};
  color: ${({ theme }) => theme.palette.blackCorner};
  border: 1px solid ${({ theme }) => theme.palette.gray300};
  font-weight: ${({ bold }) => (bold === true ? 600 : 'initial')};
  font-size: 14px;
`

const UISnackBar = forwardRef(({ id, message, variant, content, dismissResolve }, ref) => {
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
            {content && (
              <ExpandButton expanded={expanded} onClick={handleExpandToggle}>
                <ColoredExpandIcon fontSize="small" />
              </ExpandButton>
            )}
            <IconButton onClick={handleDismiss}>
              <ColoredCloseIcon fontSize="small" />
            </IconButton>
          </Grid>
        </CardActions>
        {content && (
          <Collapse in={expanded} timeout="auto">
            <Content bold>{content}</Content>
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
}
UISnackBar.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  content: PropTypes.node,
  dismissResolve: PropTypes.func,
}

export default UISnackBar
