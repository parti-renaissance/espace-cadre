import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { Grid as MuiGrid } from '@mui/material'

const Grid = styled(MuiGrid)`
  background: ${({ theme }) => theme.palette.whiteCorner};
  border-radius: 8px;
  box-shadow: 0px 0px 5px rgba(29, 33, 79, 0.03);
  &:hover {
    box-shadow: 0px 4px 10px rgba(29, 33, 79, 0.06);
  }
`

const UIContainer = ({ children, rootProps = {} }) => (
  <Grid item {...rootProps}>
    {children}
  </Grid>
)

export default UIContainer

UIContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.object]).isRequired,
  rootProps: PropTypes.object,
  sx: PropTypes.object,
  breakpoints: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
  }),
}
