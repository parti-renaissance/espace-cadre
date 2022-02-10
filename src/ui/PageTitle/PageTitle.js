import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'

const Title = styled(Typography)(
  ({ theme }) => `
  font-size: 24px;
  font-weight: 400;
  line-height: 36px;
  color: ${theme.palette.gray800};
  `
)

const PageTitle = ({ title, breakpoints = { xs: null, sm: null, md: null, lg: null, xl: null } }) => (
  <Grid
    item
    xs={breakpoints.xs}
    sm={breakpoints.sm}
    md={breakpoints.md}
    lg={breakpoints.lg}
    xl={breakpoints.xl}
    sx={{ mb: 2 }}
  >
    <Title>{title}</Title>
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
