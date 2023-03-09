import { Box, Grid, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import UICard from 'ui/Card'
import { LineContent } from '../styles'
import ZonesAccordion from '../Zone/Accordions'

const InformationTab = ({ committee }) => (
  <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <UICard
        rootProps={{ sx: { overflow: 'hidden', pt: 1, pr: 0 } }}
        content={
          <>
            <LineContent label="Nom du comité" value={committee.name} />
            <LineContent
              label="Date de création"
              value={format(new Date(committee.created_at), 'dd/MM/yyyy à HH:mm:ss')}
            />
            <LineContent label="Description" value={committee.description} />
            <Box sx={{ px: 3, py: 2 }}>
              <Typography sx={{ fontSize: '14px', fontWeight: '500', color: theme => theme.palette.colors.gray[500] }}>
                Zones
              </Typography>
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
