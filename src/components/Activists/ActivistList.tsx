import { Grid, Typography } from '@mui/material'
import CustomTable from '~/mui/custom-table/CustomTable'
import { ActivistModel } from '~/models/activist.model'
import { Adherent, PaginatedDataModel } from '~/models/common.model'
import { useMemo } from 'react'
import { getFormattedDate } from '~/utils/date'
import { parseISO } from 'date-fns'
import { CustomTableColumnModel } from '~/mui/custom-table/CustomTable.model'
import SubscriptionBadge from '~/components/Activists/SubscriptionBadge'
import ActivistZoneCell from '~/components/Activists/TableComponents/ActivistZoneCell'
import { MuiSpacing } from '~/theme/spacing'
import TagsList from '~/components/Activists/Member/TagsList'
import Profile from '~/components/shared/adherent/Profile'

interface ActivistListProps {
  paginatedData?: PaginatedDataModel<ActivistModel>
  onPageChange?: (pageToFetch: number) => void
  page?: number
  perPage?: number
  onRowsPerPageChange?: (rowsPerPage: number) => void
  isLoading?: boolean
  onLineClick?: (line: ActivistModel) => void
}

export default function ActivistList({
  paginatedData,
  onPageChange,
  page,
  perPage,
  onRowsPerPageChange,
  isLoading,
  onLineClick,
}: ActivistListProps) {
  const mappedData = useMemo(
    () =>
      paginatedData?.items?.map(el => ({
        id: el.adherent_uuid,
        ...el,
      })) ?? [],
    [paginatedData]
  )

  return (
    <CustomTable
      headerSx={{ px: MuiSpacing.normal }}
      footerSx={{ px: MuiSpacing.normal }}
      tableSx={{ minWidth: 800 }}
      data={mappedData ?? []}
      onPageChange={onPageChange}
      page={page}
      rowsPerPage={perPage}
      onRowsPerPageChange={onRowsPerPageChange}
      total={paginatedData?.metadata?.total_items ?? 0}
      isLoading={isLoading}
      columns={ActivistColumnDefinition}
      onLineClick={onLineClick}
    />
  )
}

const ActivistColumnDefinition: CustomTableColumnModel<ActivistModel & { id: string }>[] = [
  {
    index: 'id',
    title: 'ID',
    hidden: true,
  },
  {
    title: 'Militants',
    subTitle: 'Âge, civilité, PID',
    render: line => (
      <Profile
        adherent={
          {
            firstName: line.first_name,
            lastName: line.last_name,
            profileImage: line.image_url,
            age: line.age,
            gender: line.gender,
            pid: line.public_id,
          } as Adherent
        }
      />
    ),
  },
  {
    title: 'Labels',
    render: line => <TagsList tags={line.tags} />,
  },
  {
    title: 'Zone liée',
    minWidth: 200,
    subTitle: 'Circonscription, Commune, Comité',
    render: ActivistZoneCell,
  },
  {
    title: 'Date d’inscription',
    minWidth: 150,
    index: 'created_at',
    render: line => (
      <Typography variant="body2" color={'text.disabled'}>
        {getFormattedDate(parseISO(line.created_at))}
      </Typography>
    ),
  },
  {
    title: 'Abonnements',
    render: line => (
      <Grid container spacing={2}>
        <Grid item>
          <SubscriptionBadge type="phone" isSubscribed={line.sms_subscription} isEligible={Boolean(line.phone)} />
        </Grid>
        <Grid item>
          <SubscriptionBadge type="email" isSubscribed={line.email_subscription} isEligible={Boolean(line.email)} />
        </Grid>
      </Grid>
    ),
  },
]
