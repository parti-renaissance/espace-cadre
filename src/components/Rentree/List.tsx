import { MuiSpacing } from '~/theme/spacing'
import { Box, Button, Card, Container, Grid, Stack, Typography } from '@mui/material'
import CustomTable from '~/mui/custom-table/CustomTable'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { downloadInscriptions, getMeetingInscriptions } from '~/api/rentree'
import { useState } from 'react'
import { useDebounce } from '@uidotdev/usehooks'
import { PaginatedResult } from '~/api/pagination'
import { Inscription, PaymentStatusLabels } from '~/domain/meeting'
import { CustomTableColumnModel } from '~/mui/custom-table/CustomTable.model'
import Profile from '~/components/shared/adherent/Profile'
import { Adherent } from '~/models/common.model'
import { format } from 'date-fns'
import PageHeader from '~/ui/PageHeader'
import TagsList from '~/components/Activists/Member/TagsList'
import Iconify from '~/mui/iconify'

type ListFilter = {
  page: number
}

export const messages: Record<string, string> = {
  weekend: '👉 Je viens tout le weekend',
  dimanche: '👉 Je viens le dimanche seulement',
  dimanche_train: 'Forfait dimanche à Arras en train',
  dimanche_bus: 'Forfait dimanche à Arras en bus',
  gratuit_dimanche: 'Forfait autonomie',
  gratuit_we_libre: 'Forfait autonomie weekend',
  we_train: 'Forfait week-end à Arras (samedi & dimanche) en train',
  we_bus: 'Forfait week-end à Arras (samedi & dimanche) en bus',
  chambre_individuelle: '🛌 Chambre duo - 1 lit 2 places',
  chambre_partagee: '🛏️ Chambre twin - 2 lits simples',
  gratuit: "Je n'ai pas besoin d'hébergement",
}

const List = () => {
  const [filter, setFilter] = useState<ListFilter>({ page: 1 })
  const debouncedFilter = useDebounce(filter, 500)

  const { handleError } = useErrorHandler()

  const { data, isFetching } = useQueryWithScope(
    ['rentree-list', debouncedFilter, { feature: 'Rentree', view: 'List' }],
    () => getMeetingInscriptions(debouncedFilter),
    { onError: handleError }
  )

  const paginatedData = data as PaginatedResult<Inscription[]>

  return (
    <Container maxWidth={false} data-cy="contacts-container">
      <Grid container justifyContent="space-between">
        <PageHeader
          title="Rentrée 2025 • Inscriptions"
          button={
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:download-outline" />}
              onClick={() => downloadInscriptions()}
            >
              Télécharger la liste
            </Button>
          }
        />
      </Grid>

      <Box className="space-y-4">
        <Card>
          <CustomTable
            headerSx={{ px: MuiSpacing.normal }}
            footerSx={{ px: MuiSpacing.normal }}
            data={paginatedData?.data || []}
            onPageChange={page => setFilter(prev => ({ ...prev, page }))}
            page={filter.page}
            total={paginatedData?.total ?? 0}
            isLoading={isFetching}
            columns={columnDefinition}
            rowsPerPageOptions={[]}
            rowsPerPage={paginatedData?.pageSize}
          />
        </Card>
      </Box>
    </Container>
  )
}

export default List

const columnDefinition: CustomTableColumnModel<Inscription>[] = [
  {
    index: 'id',
    title: 'ID',
    hidden: true,
  },
  {
    title: 'Inscrit',
    render: inscription => (
      <Profile
        adherent={
          {
            gender: inscription.gender,
            firstName: inscription.firstName,
            lastName: inscription.lastName,
            profileImage: inscription.imageUrl,
            emailAddress: inscription.emailAddress,
            phone: inscription.phone,
          } as Adherent
        }
      />
    ),
  },
  {
    title: 'Labels',
    render: inscription => (inscription.tags ? <TagsList tags={inscription.tags} /> : ''),
  },
  {
    title: 'Forfait',
    minWidth: 300,
    render: inscription => (
      <Stack direction="column">
        <Typography>{messages[inscription.visitDay] || inscription.visitDay}</Typography>
        <Typography>{messages[inscription.transport] || inscription.transport}</Typography>
        {inscription.accommodation && (
          <Typography>{messages[inscription.accommodation] || inscription.accommodation}</Typography>
        )}
        {inscription.roommateIdentifier && (
          <Typography>Partenaire de chambre (public id) : {inscription.roommateIdentifier}</Typography>
        )}
        {inscription.isJAM && <Typography>Est JAM</Typography>}
        {Boolean(inscription.accessibility) && <Typography>Handicap</Typography>}
      </Stack>
    ),
  },
  {
    title: 'Paiement',
    minWidth: 200,
    render: inscription => (
      <Stack direction="column">
        {inscription.amount > 0 && (
          <>
            <Typography>{inscription.amount / 100} €</Typography>
            <Typography>{inscription.paymentStatus && PaymentStatusLabels[inscription.paymentStatus]}</Typography>
          </>
        )}
      </Stack>
    ),
  },
  {
    index: 'createdAt',
    title: "Date d'inscription",
    render: ({ createdAt }: Inscription) => format(createdAt, 'dd/MM/yyyy HH:mm'),
  },
  {
    index: 'updatedAt',
    title: 'Date de dernière modification',
    render: ({ updatedAt }: Inscription) => format(updatedAt, 'dd/MM/yyyy HH:mm'),
  },
  {
    index: 'confirmedAt',
    title: 'Date de confirmation',
    render: ({ confirmedAt }: Inscription) => (confirmedAt ? format(confirmedAt, 'dd/MM/yyyy HH:mm') : ''),
  },
]
