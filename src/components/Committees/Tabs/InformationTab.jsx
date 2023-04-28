import { useState } from 'react'
import { Box, Grid, Typography, Alert } from '@mui/material'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import pluralize from 'components/shared/pluralize/pluralize'
import { nl2br } from 'components/shared/helpers'
import ZoneContext from 'providers/context'
import { getFullName } from 'shared/helpers'
import UICard from 'ui/Card'
import Button from 'ui/Button/Button'
import Map from '../Map'
import { LineContent } from '../styles'
import ZonesAccordion from '../Zone/Accordions'
import UpdateAnimatorModal from './UpdateAnimatorModal'

const InformationTab = ({ committee }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
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
                <LineContent label="Description" value={nl2br(committee.description, { fontSize: '16px' })} />
                <LineContent
                  label="Membres"
                  value={`${committee.members_count} ${pluralize(committee.members_count, 'adhérent')} et ${
                    committee.sympathizers_count
                  } ${pluralize(committee.sympathizers_count, 'sympathisant')}`}
                />
                <LineContent
                  label="Responsable comité local"
                  value={
                    <Box display="flex" alignItems="start" justifyContent="space-between">
                      <Typography sx={{ fontSize: '14px', color: 'colors.gray.900', mt: '3px' }}>
                        {committee.animator ? getFullName(committee.animator) : 'Aucun'}
                      </Typography>
                      <Button isMainButton onClick={() => setIsModalOpen(true)}>
                        {committee.animator ? 'Modifier' : 'Ajouter'}
                      </Button>
                    </Box>
                  }
                />
                <Box sx={{ pr: 2.5, pl: 1, py: 2 }} className="space-y-3">
                  <Typography sx={{ fontSize: '14px', fontWeight: '500', color: 'colors.gray.500' }}>Zones</Typography>
                  <Alert severity="info">Les zones en vert foncé sont les zones appartenant à ce comité</Alert>
                  <Box
                    sx={{
                      border: '1px solid',
                      color: 'colors.gray.200',
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

      {isModalOpen && (
        <UpdateAnimatorModal
          committeeId={committee.uuid}
          animatorId={committee.animator?.uuid}
          handleClose={() => setIsModalOpen(false)}
        />
      )}
    </ZoneContext.Provider>
  )
}

export default InformationTab

InformationTab.propTypes = {
  committee: PropTypes.object.isRequired,
}
