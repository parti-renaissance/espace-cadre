import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, FormControlLabel, Grid, Typography } from '@mui/material'
import { Controller } from 'react-hook-form'
import { FixedSizeList as List } from 'react-window'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { getZones } from 'api/committees'
import { useErrorHandler } from 'components/shared/error/hooks'
import UIInputLabel from 'ui/InputLabel/InputLabel'
import Input from 'ui/Input/Input'
import Select from 'ui/Select'
import Loader from 'ui/Loader'
import { Checkbox } from 'ui/Checkbox/Checkbox'
import { committeeZones } from './constants'
import { zoneLabels } from 'domain/zone'
import ZoneItem from './Zone/ZoneItem'
import { useDebounce } from 'components/shared/debounce'

const messages = {
  title: 'Sélectionnez une liste de zones',
  checkAll: 'Tout sélectionner',
  noZones: 'Aucune zone disponible',
}

const fields = {
  search: 'q',
  types: 'types',
}

const ZonesList = ({ control, watch, zones, updatedSelectedZones }) => {
  const [filters, setFilters] = useState({ searchEvenEmptyTerm: 1, availableForCommittee: 1 })
  const { handleError } = useErrorHandler()
  const debounce = useDebounce()

  watch()

  const { data: zonesData = [], isLoading } = useQueryWithScope(
    ['committees-zones-available', { feature: 'Committees', view: 'ZonesList' }, filters],
    () => getZones(filters),
    { onError: handleError }
  )

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === fields.search || name === fields.types) {
        debounce(() => setFilters({ ...filters, [name]: value[name] }))
      }
    })
    return () => subscription.unsubscribe()
  }, [debounce, watch, filters])

  const handleSelectAll = checked => {
    updatedSelectedZones(checked ? zonesData : [])
  }

  const handleSelectOne = (e, zone) => {
    if (e.target.checked) {
      updatedSelectedZones(zones.concat([zone]))
    } else {
      updatedSelectedZones(zones.filter(item => item.uuid !== zone.uuid))
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
          <Controller
            name={fields.types}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                options={committeeZones.map(key => ({ key, value: zoneLabels[key] }))}
                onChange={type => onChange([type])}
                value={Array.isArray(value) && value.length > 0 ? value[0] : ''}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <UIInputLabel sx={{ mb: 1.5 }}>Rechercher une zone</UIInputLabel>
          <Controller
            name={fields.search}
            control={control}
            defaultValue={''}
            render={({ field: { onChange, value } }) => (
              <Input
                name={fields.search}
                onChange={onChange}
                value={value}
                placeholder="Rechercher par nom ou par code postal"
              />
            )}
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
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={zones.length === zonesData.length}
                    onChange={e => handleSelectAll(e.target.checked)}
                  />
                }
                label={
                  <Typography variant="subtitle1">
                    <Typography sx={{ fontWeight: 700 }}>{messages.checkAll}</Typography>
                  </Typography>
                }
              />
            </Box>
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
          </>
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

ZonesList.propTypes = {
  watch: PropTypes.func,
  control: PropTypes.object,
  zones: PropTypes.array,
  updatedSelectedZones: PropTypes.func,
}
