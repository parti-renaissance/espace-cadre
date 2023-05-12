import PropTypes from 'prop-types'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  IconButton,
  Tab as MuiTab,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from 'ui/Button'

export const Tab = styled(MuiTab)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.colors.gray[600],
  '&.Mui-selected': {
    color: theme.palette.colors.blue[500],
  },
}))

export const TabLabel = styled(Typography)`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`

export const LineContent = ({ label, value, labelStyle = {}, bodyStyle = {}, sx = { py: 1.5 } }) => (
  <Grid
    container
    spacing={3}
    sx={{ px: 1, borderBottom: '1px solid', borderBottomColor: theme => theme.palette.colors.gray[200], ...sx }}
  >
    <Grid item xs={12} md={4}>
      <Typography
        sx={{ fontSize: '14px', fontWeight: '500', color: theme => theme.palette.colors.gray[500], ...labelStyle }}
      >
        {label}
      </Typography>
    </Grid>
    <Grid item xs={12} md={8}>
      {value instanceof String ? (
        <Typography sx={{ fontSize: '14px', color: theme => theme.palette.colors.gray[900], ...bodyStyle }}>
          {value}
        </Typography>
      ) : (
        value
      )}
    </Grid>
  </Grid>
)

LineContent.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  labelStyle: PropTypes.object,
  bodyStyle: PropTypes.object,
  sx: PropTypes.object,
}

export const ResultCard = ({ title, icon, value }) => (
  <Grid item xs={12} md={3}>
    <Typography component="h4" sx={{ fontSize: '16px', color: 'colors.gray.700' }}>
      {title}
    </Typography>
    <Box display="flex" alignItems="center" mt={0.5} className="space-x-2">
      {icon}{' '}
      <Typography component="h3" sx={{ fontSize: '32px', color: 'colors.gray.900', fontWeight: '500' }}>
        {value}
      </Typography>
    </Box>
  </Grid>
)

ResultCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export const GroupList = ({
  header,
  canDropList,
  dropList,
  index,
  canAddCandidate,
  addCandidate,
  children,
  ...props
}) => (
  <Grid item data-cy="candidacies-group-card" {...props}>
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        bgcolor: 'whiteCorner',
        px: 1.5,
        py: 1,
        borderTopRightRadius: '6px',
        borderTopLeftRadius: '6px',
      }}
    >
      {header}
      {canDropList && (
        <IconButton edge="start" color="inherit" onClick={dropList} aria-label="delete" sx={{ ml: 0.25 }}>
          <DeleteIcon sx={{ color: theme => theme.palette.form.error.color, fontSize: '20px' }} />
        </IconButton>
      )}
    </Box>
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-content-${index}`}
        id={`panel-header-${index}`}
      >
        <Box
          sx={{ display: 'flex', flex: '1 1 0%', justifyContent: 'space-between', alignItems: 'center' }}
          className="space-x-4"
        >
          <Typography>Les candidats</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box data-cy="candidates-list-item">{children}</Box>
        {canAddCandidate && (
          <Box
            display="flex"
            alignItems="center"
            sx={{
              borderTop: '1px solid',
              borderTopColor: theme => theme.palette.colors.gray[200],
              pt: 1.5,
              mt: 2,
            }}
          >
            <Button
              onClick={addCandidate}
              aria-label="add"
              isMainButton
              rootProps={{ sx: { fontSize: '12px', px: 1.5 } }}
              data-cy="add-candidate-group"
            >
              <AddIcon sx={{ color: theme => theme.palette.colors.blue[500], fontSize: '20px' }} />
              Ajouter un candidat
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  </Grid>
)

GroupList.defaultProps = {
  canDropList: false,
  dropList: () => {},
  canAddCandidate: false,
  addCandidate: () => {},
}

GroupList.propTypes = {
  header: PropTypes.node.isRequired,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  canDropList: PropTypes.bool.isRequired,
  dropList: PropTypes.func,
  canAddCandidate: PropTypes.bool.isRequired,
  addCandidate: PropTypes.func,
  children: PropTypes.node,
}
