import { downloadAttendees, getEventAttendees } from '~/api/events'
import { useInfiniteQueryWithScope } from '~/api/useQueryWithScope'
import { getNextPageParam, PaginatedResult, usePaginatedData } from '~/api/pagination'
import { useParams } from 'react-router'
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
import Label from '~/mui/label'
import { InfiniteData } from '@tanstack/react-query'
import { useCallback } from 'react'

type Attendee = {
  uuid: string
  firstName: string
  lastName: string
  emailAddress: string
  phone: string
  subscriptionDate: string
  tags: string[]
}

const Attendees = () => {
  const { eventId } = useParams()
  const { handleError } = useErrorHandler()

  const { data: paginatedAttendees } = useInfiniteQueryWithScope(
    ['paginated-attendees', eventId, { feature: 'Events', view: 'Event' }],
    ({ pageParam: page = 1 }) => getEventAttendees(eventId, page),
    {
      getNextPageParam,
      onError: handleError,
    }
  )

  const attendees = usePaginatedData(paginatedAttendees as InfiniteData<PaginatedResult<Attendee>>)

  const onDownload = useCallback(() => downloadAttendees(eventId), [eventId])

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
          <Button variant="outlined" startIcon={<Iconify icon="eva:cloud-upload-fill" />} onClick={onDownload}>
            Télécharger la liste de mes participants
          </Button>

          {/* <Button
            variant="outlined"
            startIcon={<Iconify icon="fluent:mail-24-filled" />}
            disabled={true}
            onClick={() => {
              enqueueSnackbar('La fonctionnalité arrive bientôt...', { variant: 'info' })
            }}
          >
            Envoyer un mail aux participants
          </Button> */}
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
              <TableCell>{"Date d'inscription"}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {attendees?.map((attendee, index) => (
              <TableRow key={index}>
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
                      {attendee.emailAddress && (
                        <Typography variant="body2" color="textSecondary">
                          {attendee.emailAddress || 'aucun email'}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2}>
                    {attendee?.tags?.map((label, i) => (
                      <Label key={i} color={'success'}>
                        {label}
                      </Label>
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{attendee.phone || 'aucun numéro'}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(attendee.subscriptionDate).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
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
