import { Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const PageTitle = ({
  title,
  titleLink,
  titleSuffix,
  breakpoints = { xs: null, sm: null, md: null, lg: null, xl: null },
}) => (
  <Grid
    item
    sx={{ fontSize: 24 }}
    xs={breakpoints.xs}
    sm={breakpoints.sm}
    md={breakpoints.md}
    lg={breakpoints.lg}
    xl={breakpoints.xl}
  >
    {titleLink ? (
      <Typography variant="h4">
        <Link to={titleLink}>{title}</Link>
      </Typography>
    ) : (
      <Typography variant="h4">{title}</Typography>
    )}
    {titleSuffix && (
      <>
        <Typography variant="pageTitle" sx={{ color: 'gray400' }}>
          &nbsp;{'>'}&nbsp;
        </Typography>
        <Typography variant="pageTitle" sx={{ color: 'gray800' }}>
          {titleSuffix}
        </Typography>
      </>
    )}
  </Grid>
)

export default PageTitle

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  titleLink: PropTypes.string,
  titleSuffix: PropTypes.string,
  breakpoints: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
  }),
}
