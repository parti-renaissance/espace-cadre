import { Box, Card } from '@mui/material'
import CustomTable from '~/mui/custom-table/CustomTable.js'
import { CustomTableColumnModel } from '~/mui/custom-table/CustomTable.model'
import { PaginatedResult } from '~/api/pagination'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { getReferrals } from '~/api/referrals'
import { Referral, ReferralStatusEnum, ReferralStatusLabels, ReferralType } from '~/domain/referral'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { useState } from 'react'
import ListFilter from '~/components/Referrals/Component/ListFilter'
import { useDebounce } from '@uidotdev/usehooks'
import { format } from 'date-fns'
import { MuiSpacing } from '~/theme/spacing'
import Profile from '~/components/shared/adherent/Profile'
import { fontWeight } from '~/theme/typography'
import { UIChip } from '~/ui/Card'

export type ReferralsListFilter = {
  page: number
  referred?: string
  referrer?: string
  status?: ReferralStatusEnum
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
    <Box sx={{ mt: MuiSpacing.large }} className="space-y-4">
      <Card>
        <Box sx={{ mt: MuiSpacing.normal, mx: MuiSpacing.normal }}>
          <ListFilter filter={filter} onFilterUpdate={setFilter} />
        </Box>

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
  )
}

const columnDefinition: CustomTableColumnModel<Referral>[] = [
  {
    index: 'id',
    title: 'ID',
    hidden: true,
  },
  {
    title: 'Parrain',
    subTitle: 'Civilité - PID',
    render: ({ referrer }: Referral) => (referrer ? <Profile adherent={referrer} /> : <></>),
  },
  {
    title: 'Parrainé',
    subTitle: 'Civilité - PID',
    render: ({ referred }: Referral) => <Profile adherent={referred} />,
  },
  {
    index: 'status',
    title: 'Statut',
    render: ({ status, identifier }: Referral) => (
      <UIChip
        color="colors.blue.500"
        bgcolor="white"
        labelStyle={{ fontSize: '14px', fontWeight: fontWeight.medium }}
        key={`referral-status-badge-${identifier}`}
        label={ReferralStatusLabels[status]}
        variant="filled"
        {...chipShape(status)}
      />
    ),
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

const chipShape = (status: ReferralStatusEnum) => {
  if (status === ReferralStatusEnum.AdhesionFinished) {
    return {
      color: '#ffffff',
      bgcolor: '#538262',
    }
  }

  if (status === ReferralStatusEnum.AccountCreated) {
    return {
      color: '#ffffff',
      bgcolor: '#e7744c',
    }
  }

  if (status === ReferralStatusEnum.InvitationSent) {
    return {
      color: '#ffffff',
      bgcolor: '#545e69',
    }
  }

  if (status === ReferralStatusEnum.Reported) {
    return {
      color: '#ffffff',
      bgcolor: '#bb6345',
    }
  }

  if (status === ReferralStatusEnum.AdhesionViaOtherLink) {
    return {
      color: '#ffffff',
      bgcolor: '#8a97a6',
    }
  }
}

export default Referrals
