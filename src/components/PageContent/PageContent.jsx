import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { Container, Grid, Box, makeStyles, createStyles } from '@material-ui/core'
import { MENU } from '../../Routes'
import list from 'assets/list.svg'

const useStyles = makeStyles(theme =>
  createStyles({
    toggleButton: {
      marginBottom: theme.spacing(2),
    },
  })
)

const PageContent = ({ children }) => {
  const { pathname } = useLocation()
  const pathIndex = MENU.findIndex(path => path.route === pathname)
  const classes = useStyles()
  let pageTitle
  if (pathIndex !== -1) {
    pageTitle = MENU[pathIndex].label || null
  }

  return (
    <div id="page-content">
      <Container maxWidth="xl" className="pageContent-container">
        <Grid container justifyContent="space-between">
          <Box mb={1}>
            <button id="sidebar-collapse-button" className={`dc-container ${classes.toggleButton}`} type="button">
              <img src={list} alt="Menu button" />
            </button>
            {pageTitle && pageTitle !== 'Messagerie' && pageTitle !== 'Ripostes' && pageTitle !== 'Équipes' && (
              <span className="page-title">{pageTitle}</span>
            )}
          </Box>
        </Grid>
        {children}
      </Container>
    </div>
  )
}

export default PageContent

PageContent.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
}
