import { Box, Grid, Typography, Alert } from '@mui/material'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import UICard from 'ui/Card'
import pluralize from 'components/shared/pluralize/pluralize'
import ZoneContext from 'providers/context'
import Map from '../Map'
import { LineContent } from '../styles'
import ZonesAccordion from '../Zone/Accordions'

const InformationTab = ({ committee }) => (
  <ZoneContext.Provider value={{ zones: committee.zones }}>
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
              <LineContent
                label="Membres"
                value={`0 ${pluralize(0, 'adhérent')} et 0 ${pluralize(0, 'sympathisant')}`}
              />
              <Box sx={{ px: 3, py: 2 }} className="space-y-3">
                <Typography
                  sx={{ fontSize: '14px', fontWeight: '500', color: theme => theme.palette.colors.gray[500] }}
                >
                  Zones
                </Typography>
                <Alert severity="info">Les zones en vert foncé sont les zones appartenant à ce comité</Alert>
                <Box
                  sx={{
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
      <Grid item xs={12} md={6}>
        <Map />
      </Grid>
    </Grid>
  </ZoneContext.Provider>
)

export default InformationTab

InformationTab.propTypes = {
  committee: PropTypes.object.isRequired,
}
