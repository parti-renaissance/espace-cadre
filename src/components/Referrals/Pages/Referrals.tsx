import { Container, Grid, Typography } from '@mui/material'
import PageHeader from '~/ui/PageHeader/index.js'
import CustomTable from '~/mui/custom-table/CustomTable.js'
import { CustomTableColumnModel } from '~/mui/custom-table/CustomTable.model'
import { PaginatedResult } from '~/api/pagination'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { getReferrals } from '~/api/referrals'
import { Referral, ReferralStatus, ReferralType } from '~/domain/referral'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { useState } from 'react'
import ListFilter from '~/components/Referrals/Component/ListFilter'
import { useDebounce } from '@uidotdev/usehooks'
import { format } from 'date-fns'

const columnDefinition: CustomTableColumnModel<Referral>[] = [
  {
    index: 'id',
    title: 'ID',
    hidden: true,
  },
  {
    index: 'identifier',
    title: 'ID',
  },
  {
    title: 'Parrain',
    minWidth: 50,
    render: ({ referrer }: Referral) =>
      referrer ? (
        <Grid container direction="column">
          <Typography>
            {referrer.firstName} {(referrer.lastName || '').toUpperCase()}
          </Typography>
          <Typography>{referrer.emailAddress}</Typography>
        </Grid>
      ) : (
        <></>
      ),
  },
  {
    title: 'Parrainé',
    minWidth: 50,
    render: (row: Referral) => (
      <Grid container direction="column">
        <Typography>
          {row.firstName} {(row.lastName || '').toUpperCase()}
        </Typography>
        <Typography>{row.emailAddress}</Typography>
      </Grid>
    ),
  },
  {
    index: 'status',
    title: 'Statut',
  },
  {
    index: 'type',
    title: 'Type',
  },
  {
    index: 'createdAt',
    title: 'Créé le',
    render: ({ createdAt }: Referral) => format(createdAt, 'dd/MM/yyyy HH:mm'),
  },
]

export type ReferralsListFilter = {
  page: number
  referred?: string
  referrer?: string
  status?: ReferralStatus
  type?: ReferralType
}

const Referrals = () => {
  const [filter, setFilter] = useState<ReferralsListFilter>({ page: 1 })
  const debouncedFilter = useDebounce(filter, 500)

  const { handleError } = useErrorHandler()

  const { data: referralsData, isFetching } = useQueryWithScope(
    ['paginated-referrals', debouncedFilter, { feature: 'Referrals', view: 'List' }],
    () => getReferrals(debouncedFilter),
    { onError: handleError }
  )

  const paginatedData = referralsData as PaginatedResult<Referral[]>

  return (
    <Container maxWidth={false} data-cy="contacts-container">
      <Grid container justifyContent="space-between">
        <PageHeader title={'Parrainages'} />
      </Grid>

      <ListFilter filter={filter} onFilterUpdate={setFilter} />

      <CustomTable
        data={paginatedData?.data || []}
        onPageChange={page => setFilter(prev => ({ ...prev, page }))}
        page={filter.page}
        total={paginatedData?.total ?? 0}
        isLoading={isFetching}
        columns={columnDefinition}
        rowsPerPageOptions={[]}
        rowsPerPage={paginatedData?.pageSize}
      />
    </Container>
  )
}

export default Referrals
