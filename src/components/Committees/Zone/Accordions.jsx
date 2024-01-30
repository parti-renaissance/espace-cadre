import PropTypes from 'prop-types'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, IconButton } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteIcon from '@mui/icons-material/Delete'
import { groupBy } from 'lodash'
import { zoneLabels } from '~/domain/zone'
import EmptyContent from '~/ui/EmptyContent'

const messages = {
  noData: 'Aucune zone sélectionnée',
}

const ZonesAccordion = ({ selectedZones, onRemoveZone }) => {
  const zonesGroup = groupBy(selectedZones, 'type')

  if (!selectedZones.length) {
    return <EmptyContent description={messages.noData} />
  }

  return (
    <>
      {Object.keys(zonesGroup).map((group, index) => {
        const zones = zonesGroup[group]

        return (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}a-content`}
              id={`panel${index}a-header`}
            >
              <Typography>
                {zoneLabels[group]} ({zones.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column' }} className="space-y-2">
                {zones.map(zone => (
                  <Box key={zone.uuid} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '14px', color: theme => theme.palette.colors.gray[500] }}>
                      {zone.name}
                    </Typography>
                    {onRemoveZone && (
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => onRemoveZone(zone)}
                        aria-label="remove-zone"
                        sx={{ ml: 1.5 }}
                      >
                        <DeleteIcon sx={{ color: theme => theme.palette.form.error.color, fontSize: '18px' }} />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </>
  )
}

export default ZonesAccordion

ZonesAccordion.propTypes = {
  selectedZones: PropTypes.array,
  onRemoveZone: PropTypes.func,
}
