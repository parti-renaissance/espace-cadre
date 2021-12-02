import { Grid } from '@mui/material'
import PageTitle from 'ui/PageTitle'
import AddButton from 'ui/AddButton'
import PropTypes from 'prop-types'

const PageHeader = ({ title, message, parentStyles, handleAction }) => (
  <>
    <Grid item>
      <PageTitle title={title} />
    </Grid>
    <Grid item>
      <AddButton message={message} parentStyles={parentStyles} handleAction={handleAction} />
    </Grid>
  </>
)

export default PageHeader

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  parentStyles: PropTypes.object.isRequired,
  handleAction: PropTypes.func.isRequired,
}
