import React from 'react'
import { Grid } from '@mui/material'
import PageTitle from 'ui/PageTitle'
import AddButton from 'ui/AddButton'
import PropTypes from 'prop-types'

const PageHeader = ({ title, message, parentStyles }) => (
  <>
    <Grid item>
      <PageTitle title={title} />
    </Grid>
    <Grid item>
      <AddButton message={message} parentStyles={parentStyles} />
    </Grid>
  </>
)

export default PageHeader

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  parentStyles: PropTypes.object.isRequired,
}
