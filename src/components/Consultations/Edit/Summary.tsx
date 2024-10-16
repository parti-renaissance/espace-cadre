import { DesignationType } from '~/domain/designation'
import {
  Alert,
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { add, format, sub } from 'date-fns'
import { useTargetChoices } from '~/components/Consultations/Edit/form'
import { find } from 'lodash'
import { nl2br } from '~/components/shared/helpers'

const Summary = ({ designation }: { designation: DesignationType }) => {
  const targetChoices = useTargetChoices()

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
            <Typography>{designation.customTitle}</Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs>
            <Typography variant="h6" sx={{ textWrap: 'nowrap' }}>
              Description :
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography>{nl2br(designation.description)}</Typography>
          </Grid>
        </Grid>

        {designation.voteStartDate && (
          <>
            <Grid container spacing={2}>
              <Grid item xs>
                <Typography variant="h6" sx={{ textWrap: 'nowrap' }}>
                  Date, heure du début :
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>{format(designation.voteStartDate, 'dd/MM/yyyy à HH:mm')}</Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs>
                <Typography variant="h6" sx={{ textWrap: 'nowrap' }}>
                  Date, heure de fin :
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>{format(designation.voteEndDate, 'dd/MM/yyyy à HH:mm')}</Typography>
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
                  key={designation.target}
                  label={find(targetChoices, { value: designation.target })?.label}
                  sx={{ marginRight: 1 }}
                />
              </Grid>
            </Grid>

            {designation.questions.map((question, questionIndex) => (
              <Stack
                key={`question-${questionIndex}`}
                spacing={2}
                padding={2}
                sx={{ backgroundColor: 'gray100', borderRadius: '8px' }}
              >
                <Typography variant="h6">
                  {questionIndex + 1}
                  {questionIndex + 1 === 1 ? 'ère' : 'ème'} question
                </Typography>
                <Typography>{question.content}</Typography>
                <Stack spacing={1}>
                  {question.choices.map((choice, choiceIndex) => (
                    <Stack direction={'row'} key={`question-choice-${choiceIndex}`} spacing={1}>
                      <Grid container spacing={2}>
                        <Grid item xs>
                          <Typography variant={'h6'} noWrap>
                            Bulletin {choiceIndex + 1} :
                          </Typography>
                        </Grid>
                        <Grid item xs={9}>
                          <Typography>{choice.label}</Typography>
                        </Grid>
                      </Grid>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            ))}

            <Typography variant="h6" mt={4}>
              Calendrier prévisionnel
            </Typography>

            <TableContainer component={Paper} sx={{ border: '1px solid #ccc' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date relative</TableCell>
                    <TableCell>Date absolue</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Ouverture du vote J-2</TableCell>
                    <TableCell>{format(sub(designation.voteStartDate, { days: 2 }), 'dd/MM/yyyy, HH:mm')}</TableCell>
                    <TableCell>
                      <Stack spacing={2}>
                        <Typography>Notification des adhérents par email et push qu’un vote aura lieu.</Typography>
                        <Typography>Affichage dans l’espace militant.</Typography>
                        <Typography>
                          Impossible de modifier le vote. Impossible d’adhérer pour participer au vote.
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Ouverture du vote</TableCell>
                    <TableCell>{format(designation.voteStartDate, 'dd/MM/yyyy, HH:mm')}</TableCell>
                    <TableCell>
                      <Typography>Notification des adhérents par email et push que le vote est ouvert.</Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Fin du vote J-1 si durée du vote ≥ 2j</TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>
                      <Typography>
                        Notification des non-votants par email et push que le vote termine dans 1j.
                      </Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Fin du vote H-1h si durée du vote ≥ 2h</TableCell>
                    <TableCell>{format(sub(designation.voteEndDate, { hours: 1 }), 'dd/MM/yyyy, HH:mm')}</TableCell>
                    <TableCell>
                      <Typography>
                        Notification des non-votants par email et push que le vote termine dans 1h.
                      </Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Fin du vote</TableCell>
                    <TableCell>{format(designation.voteEndDate, 'dd/MM/yyyy, HH:mm')}</TableCell>
                    <TableCell>
                      <Typography>
                        Notification des adhérents par email et push que les résultats sont disponibles.
                      </Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Fin du vote J+3</TableCell>
                    <TableCell>{format(add(designation.voteEndDate, { days: 3 }), 'dd/MM/yyyy, HH:mm')}</TableCell>
                    <TableCell>
                      <Typography>Fin de l’affichage dans l’espace militant.</Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Fin du vote J+30</TableCell>
                    <TableCell>{format(add(designation.voteEndDate, { days: 30 }), 'dd/MM/yyyy, HH:mm')}</TableCell>
                    <TableCell>
                      <Typography>Fin de l’accès public aux résultats.</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Alert severity="error">
              Une fois programmé, vous aurez jusqu’à J-2 - le{' '}
              {format(sub(designation.voteStartDate, { days: 2 }), 'dd/MM/yyyy, HH:mm')}, - pour modifier les paramètres
              de vote. Après cette date, seuls le titre et la description resteront éditables.
            </Alert>

            <Alert severity="error">Le vote ne se substitue pas à l’envoi du mail statutaire.</Alert>
          </>
        )}
      </Stack>
    </Box>
  )
}

export default Summary
