import PropTypes from 'prop-types'
import { Grid } from '@mui/material'

const PhoningCampaignSurveys = ({ surveys = [] }) => <Grid container spacing={2}></Grid>

PhoningCampaignSurveys.propTypes = {
  surveys: PropTypes.array.isRequired,
}

export default PhoningCampaignSurveys
