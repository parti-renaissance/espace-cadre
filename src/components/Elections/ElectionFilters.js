import PropTypes from 'prop-types'
import { useMemo, Fragment } from 'react'
import mapboxgl from '!mapbox-gl'
import { Grid, Box, makeStyles } from '@material-ui/core'

import { ElectionDetails, LayersTypes } from './shared/constants'

import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const useStyles = makeStyles(theme => ({
  mapHelp: {
    color: theme.palette.blackCorner,
    fontSize: '12px',
    marginTop: theme.spacing(1.25),
  },
}))

const ElectionFilters = ({ filterValues, handleTypeSelection, handleDetailSelection }) => {
  const classes = useStyles()
  const { election, year, round } = filterValues

  const electionTypesOptions = useMemo(() => Object.entries(LayersTypes).map(([code, label]) => ({ code, label })), [])

  return (
    <Grid container spacing={2}>
      <Grid item>
        <select className={classes.layerSelect} onChange={handleTypeSelection}>
          {electionTypesOptions.map(({ code, label }) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </Grid>
      <Grid item>
        <select onChange={handleDetailSelection} value={`${election}_${year}_${round}`}>
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
        </select>
      </Grid>
      <Grid item>
        <Box className={classes.mapHelp}>
          Aidez-nous à améliorer cette carte en écrivant à&nbsp;
          <a href="mailto:techsupport@en-marche.fr">techsupport@en-marche.fr</a>
        </Box>
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
