import { getEventAttendees } from '~/api/events'
import { useInfiniteQueryWithScope } from '~/api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from '~/api/pagination'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { Box, Stack } from '@mui/system'
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import pluralize from '~/components/shared/pluralize/pluralize'
import Iconify from '~/mui/iconify'
import Label, { LabelColor } from '~/mui/label'

const Attendees = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()

  const {
    data: paginatedAttendees,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQueryWithScope(
    ['paginated-attendees', eventId, { feature: 'Events', view: 'Event' }],
    ({ pageParam: page = 1 }) => getEventAttendees(eventId, page),
    {
      getNextPageParam,
      onError: handleError,
    }
  )

  const attendees = usePaginatedData(paginatedAttendees)

  console.log(attendees)

  return (
    <Box>
      <Stack
        justifyContent="space-between"
        spacing={2}
        direction="row"
        alignItems="center"
        sx={{
          marginBottom: '2em',
        }}
      >
        <Typography variant="h6">{pluralize(attendees?.length, 'Participant')}</Typography>

        <Stack spacing={2} direction="row">
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={() => {
              throw new Error('Not implemented')
            }}
          >
            Télécharger les infos des participants
          </Button>

          <Button
            variant="outlined"
            startIcon={<Iconify icon="fluent:mail-24-filled" />}
            onClick={() => {
              throw new Error('Not implemented')
            }}
          >
            Envoyer un mail aux participants
          </Button>
        </Stack>
      </Stack>
      <Card sx={{ width: 1 }}>
        <CardHeader
          title={
            <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2">
                Tout les participants{' '}
                <Label color={'primary'} ml={1}>
                  {attendees?.length}
                </Label>
              </Typography>
            </Stack>
          }
        />
        <Table sx={{ mt: '24px' }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Membre</TableCell>
              <TableCell>Labels</TableCell>
              <TableCell>Numéro de téléphone</TableCell>
              <TableCell>Date d'inscription</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {attendees?.map(attendee => (
              <TableRow key={attendee.uuid}>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: 'info.lighter',
                      }}
                    >
                      <Typography color="grey.600" fontWeight="600">
                        {`${attendee.firstName[0]}`.toUpperCase()}
                      </Typography>
                    </Avatar>

                    <Stack direction="column">
                      <Typography variant="body2">{`${attendee.firstName} ${attendee.lastName}`.trim()}</Typography>
                      {attendee.email && (
                        <Typography variant="body2" color="textSecondary">
                          {attendee.email || 'aucun email'}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </TableCell>

                <TableCell>
                  <Stack direction="row" spacing={2}>
                    <Label color={'warning'} startIcon={<Iconify icon="eva:person-fill" />}>
                      Membre
                    </Label>
                    <Label color={'success'}>Participant</Label>
                  </Stack>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">{attendee.phoneNumber || '06 00 00 00 00'}</Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">{attendee.createdAt || '22 décembre 2024'}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Box>
  )
}

export default Attendees
