import { useContext, useState } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { FixedSizeList as List } from 'react-window'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { getZones } from '~/api/committees'
import { useErrorHandler } from '~/components/shared/error/hooks'
import UIInputLabel from '~/ui/InputLabel/InputLabel'
import Input from '~/ui/Input/Input'
import Select from '~/ui/Select'
import Loader from '~/ui/Loader'
import { committeeZones } from './constants'
import { zoneLabels, zoneTypes } from '~/domain/zone'
import ZoneItem from './Zone/ZoneItem'
import { useDebounce } from '~/components/shared/debounce'
import ZoneContext from '~/providers/context'

const messages = {
  title: 'Sélectionnez une liste de zones',
  noZones: 'Aucune zone disponible',
}

const ZonesList = () => {
  const [filters, setFilters] = useState({ types: [zoneTypes.CITY] })
  const { handleError } = useErrorHandler()
  const { zones, setZones } = useContext(ZoneContext)
  const debounce = useDebounce()

  const { data: zonesData = [], isLoading } = useQueryWithScope(
    ['committees-zones-available', { feature: 'Committees', view: 'ZonesList' }, filters],
    () => getZones(filters),
    { onError: handleError }
  )

  const handleSelectOne = (zone, checked) => {
    if (checked) {
      setZones(prevState => prevState.concat([zone]))
    } else {
      setZones(prevState => prevState.filter(item => item.uuid !== zone.uuid))
    }
  }

  return (
    <Box
      sx={{ borderTop: '1px solid', borderColor: theme => theme.palette.colors.gray[200], mt: 4, pt: 3 }}
      className="space-y-4"
    >
      <Typography variant="h5" sx={{ fontSize: '18px', color: theme => theme.palette.colors.gray[700] }}>
        {messages.title} (
        <Typography component="span" sx={{ color: '#991b1b' }}>
          *
        </Typography>
        )
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <UIInputLabel>Types de zone</UIInputLabel>
          <Select
            options={committeeZones.map(key => ({ key, value: zoneLabels[key] }))}
            onChange={type => setFilters(prevState => ({ ...prevState, types: [type] }))}
            value={filters?.types?.length > 0 ? filters.types[0] : ''}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <UIInputLabel sx={{ mb: 1.5 }}>Rechercher une zone</UIInputLabel>
          <Input
            onChange={e => debounce(() => setFilters(prevState => ({ ...prevState, q: e.target.value })))}
            placeholder="Rechercher par nom ou par code postal"
          />
        </Grid>
      </Grid>
      <Box className="space-y-4">
        {(!zonesData || isLoading) && (
          <Grid container justifyContent="center">
            <Loader />
          </Grid>
        )}
        {zonesData.length > 0 && (
          <List
            height={600}
            itemCount={zonesData.length}
            itemData={zonesData.sort((a, b) => zones.includes(b.uuid) - zones.includes(a.uuid))}
            itemSize={68}
          >
            {({ index, style, data }) => {
              const zone = data[index]
              return (
                <div style={style}>
                  <ZoneItem
                    key={zone.uuid}
                    zone={zone}
                    handleSelectOne={handleSelectOne}
                    isCheck={zones.some(item => item.uuid === zone.uuid)}
                  />
                </div>
              )
            }}
          </List>
        )}

        {zonesData.length === 0 && !isLoading && (
          <Typography component="p" sx={{ color: theme => theme.palette.colors.gray[700], textAlign: 'center', py: 3 }}>
            {messages.noZones}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default ZonesList
