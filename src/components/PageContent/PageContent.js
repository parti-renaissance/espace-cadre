import PropTypes from 'prop-types'
import { Container } from '@mui/material'
import { makeStyles } from '@mui/styles'
import createStyles from '@mui/styles/createStyles'
import ListIcon from 'ui/icons/ListIcon'

const useStyles = makeStyles(theme =>
  createStyles({
    pageContent: {
      width: `calc(100% - ${theme.spacing(34)})`,
      margin: theme.spacing(2, 0, 0, 34),
      transition: 'all 0.4s',
      '&.active': {
        width: '100%',
        marginLeft: 0,
      },
      [theme.breakpoints.down('lg')]: {
        width: '100%',
        marginLeft: 0,
        '&.active': {
          width: `calc(100% - ${theme.spacing(34)})`,
          marginLeft: theme.spacing(34),
        },
      },
    },
    container: {
      padding: theme.spacing(0, 2),
    },
    toggleButton: {
      height: '34px',
      width: '40px',
      color: theme.palette.grayCorner3,
      backgroundColor: theme.palette.whiteCorner,
      border: 'none',
      cursor: 'pointer',
      margin: theme.spacing(0.75, 0, 2),
      borderRadius: '6px',
    },
  })
)

const PageContent = ({ children, handleToggle, toggleSidebar }) => {
  const classes = useStyles()

  return (
    <div id="pageContent" className={`${classes.pageContent}  ${toggleSidebar ? 'active' : ''}`}>
      <Container maxWidth="xl" className={classes.container}>
        <button className={classes.toggleButton} onClick={handleToggle}>
          <ListIcon alt="Menu button" />
        </button>
        {children}
      </Container>
    </div>
  )
}

export default PageContent

PageContent.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
  toggleSidebar: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
}
