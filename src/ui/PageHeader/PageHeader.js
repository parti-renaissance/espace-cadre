import PropTypes from 'prop-types'
import { Grid } from '@mui/material'
import PageTitle from 'ui/PageTitle'
import MainButton from 'ui/MainButton'

const PageHeader = ({ title, handleClick, message, icon }) => (
  <>
    <Grid item>
      <PageTitle title={title} />
    </Grid>
    <Grid item>
      <MainButton handleClick={handleClick}>
        {icon}
        {message}
      </MainButton>
    </Grid>
  </>
)

export default PageHeader

PageHeader.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  handleClick: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
}
