import { Designation } from '~/domain/designation'
import FinalResults from '~/components/Consultations/Show/Tabs/Results/FinalResults'
import ForecastStatistics from '~/components/Consultations/Components/ForecastStatistics'
import { Stack } from '@mui/material'

const Statistics = ({ designation }: { designation: Designation }) => (
  <Stack spacing={2}>
    <ForecastStatistics designation={designation} />
    <FinalResults designation={designation} />
  </Stack>
)

export default Statistics
