import PropTypes from 'prop-types'
import { Grid, Box } from '@mui/material'
import PageTitle from 'ui/PageTitle'
import Button from 'ui/Button'
import AddIcon from '@mui/icons-material/Add'

export const PageHeaderButton = ({ onClick, label, icon = <AddIcon />, isMainButton = false }) => (
  <Button onClick={onClick} isMainButton={isMainButton}>
    {icon}
    <Box component="span" sx={{ ml: 1 }}>
      {label}
    </Box>
  </Button>
)

PageHeaderButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  icon: PropTypes.object,
  isMainButton: PropTypes.bool,
}

const PageHeader = ({ title, titleLink, titleSuffix, button }) => (
  <>
    <Grid item data-cy="ui-page-header" sx={{ mb: 2.5 }}>
      <PageTitle title={title} titleLink={titleLink} titleSuffix={titleSuffix} />
    </Grid>
    {button && (
      <Grid item data-cy="ui-page-header-button">
        {button}
      </Grid>
    )}
  </>
)

export default PageHeader

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  titleLink: PropTypes.string,
  titleSuffix: PropTypes.string,
  button: PropTypes.node,
}
