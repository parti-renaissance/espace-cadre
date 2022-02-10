import { Grid } from '@mui/material'
import PropTypes from 'prop-types'

const PageTitle = ({ title, breakpoints = { xs: null, sm: null, md: null, lg: null, xl: null } }) => (
  <Grid
    item
    sx={{ fontSize: 24, mb: 2 }}
    xs={breakpoints.xs}
    sm={breakpoints.sm}
    md={breakpoints.md}
    lg={breakpoints.lg}
    xl={breakpoints.xl}
  >
    {title}
  </Grid>
)

export default PageTitle

PageTitle.propTypes = {
  title: PropTypes.node.isRequired,
  breakpoints: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
  }),
}
