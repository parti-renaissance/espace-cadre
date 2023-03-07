import { Box, Grid, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import InfoIcon from '@mui/icons-material/Info'
import UICard from 'ui/Card'
import ZonesAccordion from '../Zone/Accordions'
import { format } from 'date-fns'

const LineContent = ({ label, value }) => (
  <Grid
    container
    spacing={3}
    sx={{ py: 2, px: 3, borderBottom: '1px solid', borderBottomColor: theme => theme.palette.colors.gray[200] }}
  >
    <Grid item xs={12} md={4}>
      <Typography sx={{ fontSize: '14px', fontWeight: '500', color: theme => theme.palette.colors.gray[500] }}>
        {label}
      </Typography>
    </Grid>
    <Grid item xs={12} md={8}>
      <Typography sx={{ fontSize: '14px', color: theme => theme.palette.colors.gray[900] }}>{value}</Typography>
    </Grid>
  </Grid>
)

LineContent.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
}

const InformationTab = ({ committee }) => (
  <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <UICard
        rootProps={{ sx: { overflow: 'hidden', pt: 1 } }}
        content={
          <>
            <LineContent label="Nom du comité" value={committee.name} />
            <LineContent
              label="Date de création"
              value={`${format(new Date(committee.created_at), 'dd/MM/yyyy')} à ${format(
                new Date(committee.created_at),
                'HH:mm'
              )}`}
            />
            <LineContent label="Description" value={committee.description} />
            <Box sx={{ px: 3, py: 2 }}>
              <Typography sx={{ fontSize: '14px', fontWeight: '500', color: theme => theme.palette.colors.gray[500] }}>
                Zones
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  mt: 1,
                  px: 2.5,
                  py: 1.5,
                  bgcolor: '#EFF6FF',
                  borderRadius: '8px',
                  color: theme => theme.palette.colors.blue[600],
                }}
              >
                <InfoIcon sx={{ fontSize: '20px', mr: 2 }} />
                <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>
                  Les zones en vert foncé sont les zones appartenant à ce comité
                </Typography>
              </Box>
              <Box
                sx={{
                  mt: 1.5,
                  border: '1px solid',
                  color: theme => theme.palette.colors.gray[200],
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <ZonesAccordion selectedZones={committee.zones} />
              </Box>
            </Box>
          </>
        }
      />
    </Grid>
    <Grid item xs={12} md={6}></Grid>
  </Grid>
)

export default InformationTab

InformationTab.propTypes = {
  committee: PropTypes.object.isRequired,
}
