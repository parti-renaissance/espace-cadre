import PropTypes from 'prop-types'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import _ from 'lodash'
import { zonesTypes } from 'shared/constants'
import EmptyContent from 'ui/EmptyContent'

const messages = {
  noData: 'Aucune zone sélectionnée',
}

const ZonesAccordion = ({ selectedZones }) => {
  const zonesGroup = _.groupBy(selectedZones, 'type')

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
                {zonesTypes[group]} ({zones.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column' }} className="space-y-2">
                {zones.map(zone => (
                  <Typography sx={{ fontSize: '14px', color: theme => theme.palette.colors.gray[500] }} key={zone.uuid}>
                    {zone.name}
                  </Typography>
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
}
