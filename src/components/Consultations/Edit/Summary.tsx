import { Designation, DesignationType } from '~/domain/designation'
import { Alert, Box, Chip, Grid, Stack, Typography } from '@mui/material'
import { format, sub } from 'date-fns'
import { useTargetYearChoices } from '~/components/Consultations/Edit/form'
import { find } from 'lodash'
import { nl2br } from '~/components/shared/helpers'
import { messages } from '~/components/Consultations/messages'
import QuestionsList from '~/components/Consultations/Components/QuestionsList'
import Calendar from '~/components/Consultations/Components/Calendar'
import ForecastStatistics from '~/components/Consultations/Components/ForecastStatistics'

const Summary = ({ formData, designation }: { formData: DesignationType; designation: Designation }) => {
  const targetChoices = useTargetYearChoices()
  const term = messages[designation.type].item

  return (
    <Box>
      <Typography variant="h4" marginBottom={4}>
        Récapitulatif
      </Typography>

      <Stack spacing={2} mt={2} marginLeft={2} marginY={2}>
        <Grid container>
          <Grid item xs>
            <Typography variant="h6">Titre :</Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography>{formData.customTitle}</Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs>
            <Typography variant="h6" sx={{ textWrap: 'nowrap' }}>
              Description :
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography>{nl2br(formData.description)}</Typography>
          </Grid>
        </Grid>

        {formData.voteStartDate && (
          <>
            <Grid container>
              <Grid item xs>
                <Typography variant="h6" sx={{ textWrap: 'nowrap' }}>
                  Date, heure du début :
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>{format(formData.voteStartDate, 'dd/MM/yyyy à HH:mm')}</Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs>
                <Typography variant="h6" sx={{ textWrap: 'nowrap' }}>
                  Date, heure de fin :
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>{format(formData.voteEndDate, 'dd/MM/yyyy à HH:mm')}</Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs>
                <Typography variant="h6" sx={{ textWrap: 'nowrap' }}>
                  Personnes concernées :
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Chip
                  key={formData.targetYear}
                  label={find(targetChoices, { value: formData.targetYear })?.label}
                  sx={{ marginRight: 1 }}
                />
              </Grid>
            </Grid>

            <QuestionsList questions={formData.questions} term={term} />

            <Calendar designation={formData} />

            <ForecastStatistics designation={formData} />

            <Alert severity="error">
              Une fois programmé, vous aurez jusqu’à J-2 - le{' '}
              {format(sub(formData.voteStartDate, { days: 2 }), 'dd/MM/yyyy, HH:mm')}, - pour modifier les paramètres de
              vote.
              <br />
              Après cette date, seuls le titre et la description resteront éditables.
            </Alert>

            <Alert severity="error">Le vote ne se substitue pas à l’envoi du mail statutaire.</Alert>
          </>
        )}
      </Stack>
    </Box>
  )
}

export default Summary
