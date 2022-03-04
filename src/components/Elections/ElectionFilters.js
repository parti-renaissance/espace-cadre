import PropTypes from 'prop-types'
import { useMemo, Fragment } from 'react'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import mapboxgl from '!mapbox-gl'
import { ElectionDetails } from './shared/constants'

import 'mapbox-gl/dist/mapbox-gl.css'
import { LayersCodes, LayersTypes } from 'components/Map/Layers'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const Contact = styled(Typography)(
  ({ theme }) => `
  color: ${theme.palette.blackCorner};
  font-size: 12px;
  margin-top: ${theme.spacing(1.25)}
`
)

const Select = styled('select')`
  font-size: 16px;
  padding: ${({ theme }) => theme.spacing(0.75, 1.5)};
  border: none;
  outline: none;
  border-radius: 6px;
`

const messages = {
  help: 'Aidez-nous à améliorer cette carte en écrivant à',
  mail: 'techsupport@en-marche.fr',
}

const ElectionFilters = ({ filterValues, handleTypeSelection, handleDetailSelection }) => {
  const { election, year, round } = filterValues

  const electionTypesOptions = useMemo(
    () =>
      Object.entries(LayersTypes)
        .filter(([code]) => code !== LayersCodes.ciblagePapShape)
        .map(([code, label]) => ({ code, label })),
    []
  )

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Select onChange={handleTypeSelection}>
          {electionTypesOptions.map(({ code, label }) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </Select>
      </Grid>
      <Grid item>
        <Select onChange={handleDetailSelection} value={`${election}_${year}_${round}`}>
          {ElectionDetails.map(({ label, year, rounds }, index) => (
            <Fragment key={index}>
              <option key={`${label}_${year}_1`} value={`${label}_${year}_1`}>
                {`${label} ${year} - ${rounds === 1 ? 'Tour unique' : '1er tour'}`}
              </option>
              {rounds === 2 && (
                <option key={`${label}_${year}_2`} value={`${label}_${year}_2`}>
                  {`${label} ${year} - 2er tour`}
                </option>
              )}
            </Fragment>
          ))}
        </Select>
      </Grid>
      <Grid item>
        <Contact>
          {messages.help}&nbsp;
          <a href="mailto:techsupport@en-marche.fr">{messages.mail}</a>
        </Contact>
      </Grid>
    </Grid>
  )
}

ElectionFilters.propTypes = {
  filterValues: PropTypes.shape({
    election: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    round: PropTypes.string,
  }),
  handleTypeSelection: PropTypes.func.isRequired,
  handleDetailSelection: PropTypes.func.isRequired,
}

export default ElectionFilters
