import { Grid as MuiGrid } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'

const Grid = styled(MuiGrid)(
  ({ theme }) => `
  font-size: 24px;
  font-weight: 400;
  color: ${theme.palette.gray800};
  margin-bottom: ${theme.spacing(2)};
`
)

const PageTitle = ({ title, breakpoints = { xs: null, sm: null, md: null, lg: null, xl: null } }) => (
  <Grid item xs={breakpoints.xs} sm={breakpoints.sm} md={breakpoints.md} lg={breakpoints.lg} xl={breakpoints.xl}>
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
