import { Chip, Stack, Typography } from '@mui/material'
import { AccessTime, DateRange } from '@mui/icons-material'
import { formatDate } from '~/shared/helpers'
import { find } from 'lodash'
import { nl2br } from '~/components/shared/helpers'
import { Designation } from '~/domain/designation'
import { useTargetYearChoices } from '~/components/Consultations/Edit/form'
import { messages } from '~/components/Consultations/messages'
import QuestionsList from '~/components/Consultations/Components/QuestionsList'

const Main = ({ designation }: { designation: Designation }) => {
  const targetChoices = useTargetYearChoices()

  return (
    <Stack spacing={2} mt={2} marginLeft={2} marginY={2}>
      <Stack direction={'row'} alignItems={'center'}>
        <DateRange sx={{ mr: 0.5, color: 'colors.gray.400', fontSize: '15px' }} />
        <Typography variant="subtitle2" sx={{ color: 'colors.gray.500' }}>
          Date, heure du vote
        </Typography>
      </Stack>
      <Stack>
        <Typography sx={{ color: 'colors.gray.500' }}>
          Début le {formatDate(designation.voteStartDate, 'dd/MM/yyyy à HH:mm')}
        </Typography>
        <Typography sx={{ color: 'colors.gray.500' }}>
          Fin le {formatDate(designation.voteEndDate, 'dd/MM/yyyy à HH:mm')}
        </Typography>
      </Stack>
      <Stack direction={'row'} alignItems={'center'}>
        <AccessTime sx={{ mr: 0.5, color: 'colors.gray.400', fontSize: '15px' }} />
        <Typography variant="subtitle2" sx={{ color: 'colors.gray.500' }}>
          Créé le {formatDate(designation.createdAt, 'dd/MM/yyyy à HH:mm')}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <Typography sx={{ textWrap: 'nowrap' }}>Personnes concernées :</Typography>
        <Chip
          key={designation.targetYear}
          label={(find(targetChoices, { value: designation.targetYear }) as { label: string } | undefined)?.label}
          sx={{ marginRight: 1 }}
        />
      </Stack>
      <Typography>{nl2br(designation.description)}</Typography>

      <QuestionsList questions={designation.questions} term={messages[designation.type].item} />
    </Stack>
  )
}

export default Main
