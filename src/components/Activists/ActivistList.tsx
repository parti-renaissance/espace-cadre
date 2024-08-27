import { Grid, Typography } from '@mui/material'
import CustomTable from '~/mui/custom-table/CustomTable'
import { ActivistModel } from '~/models/activist.model'
import { PaginatedDataModel } from '~/models/common.model'
import { useMemo } from 'react'
import { fullName, getInitials, guessHumanReadableTitleBasedOnGender } from '~/utils/names'
import { getFormattedDate } from '~/utils/date'
import { parseISO } from 'date-fns'
import { compact } from 'lodash'
import { CustomTableColumnModel } from '~/mui/custom-table/CustomTable.model'
import Avatar from '~/mui/avatar/Avatar'
import SubscriptionBadge from '~/components/Activists/SubscriptionBadge'
import pluralize from '~/components/shared/pluralize/pluralize'
import { activistTagShape } from '~/shared/activistTagShape'
import { UIChip } from '~/ui/Card'
import { tagsColor } from '~/theme/palette'
import { fontWeight } from '~/theme/typography'
import ActivistZoneCell from '~/components/Activists/TableComponents/ActivistZoneCell'
import { MuiSpacing } from '~/theme/spacing'

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
    title: '',
    minWidth: 50,
    render: line => <Avatar src={line.image_url} initials={getInitials(line)} />,
  },
  {
    title: 'Militants',
    minWidth: 150,
    subTitle: 'Âge, civilité',
    render: line => {
      const formattedText = compact([
        line.birthdate !== null ? `${line.age} ${pluralize(line.age, 'an')}` : undefined,
        guessHumanReadableTitleBasedOnGender(line.gender),
      ])

      return (
        <>
          <div>
            <Typography variant="body2" fontWeight={fontWeight.medium}>
              {fullName(line)}
            </Typography>
          </div>
          <div>
            <Typography variant="body2" color={'text.disabled'}>
              {formattedText.join(', ')}
            </Typography>
          </div>
        </>
      )
    },
  },
  {
    title: 'Labels',
    render: line => (
      <>
        {line.tags.map(tag => (
          <UIChip
            key={tag.label}
            label={tag.label}
            sx={{ mb: line.tags.length > 1 ? 1 : 0 }}
            labelStyle={{ fontSize: '14px', fontWeight: fontWeight.medium }}
            color={activistTagShape[tag.type]?.color ?? tagsColor.unknownText}
            variant={activistTagShape[tag.type]?.variant ?? 'contained'}
            bgcolor={activistTagShape[tag.type]?.bgColor ?? tagsColor.unknownBackground}
          />
        ))}
      </>
    ),
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
