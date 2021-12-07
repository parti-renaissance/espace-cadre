import { Grid } from '@mui/material'
import PageTitle from 'ui/PageTitle'
import AddButton from 'ui/AddButton'
import PropTypes from 'prop-types'

const PageHeader = ({ title, message, handleAction, actionButtonProps }) => (
  <>
    <Grid item>
      <PageTitle title={title} />
    </Grid>
    <Grid item>
      <AddButton message={message} handleAction={handleAction} {...actionButtonProps} />
    </Grid>
  </>
)

export default PageHeader

PageHeader.propTypes = {
  title: PropTypes.node.isRequired,
  message: PropTypes.string.isRequired,
  actionButtonProps: PropTypes.object,
  handleAction: PropTypes.func.isRequired,
}
