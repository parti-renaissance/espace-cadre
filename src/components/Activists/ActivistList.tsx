import { Card, Typography } from '@mui/material'
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
    <Card sx={{ p: 2 }}>
      <CustomTable
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
    </Card>
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
    render: line => <Avatar initials={getInitials(line)} />,
  },
  {
    title: 'Militants',
    subTitle: 'Âge, civilité',
    render: line => {
      const formattedText = compact([
        line.birthdate !== null ? getFormattedDate(parseISO(line.birthdate)) : undefined,
        guessHumanReadableTitleBasedOnGender(line.gender),
      ])

      return (
        <>
          <strong>{fullName(line)}</strong>
          <div>{formattedText.join(', ')}</div>
        </>
      )
    },
  },
  {
    title: 'Labels',
  },
  {
    title: 'Zone liée',
    subTitle: 'Comité',
    render: line => (
      <>
        <div>
          <Typography>{line.committee}</Typography>
        </div>
        <div>
          <Typography color={'text.disabled'}>{line.city}</Typography>
        </div>
      </>
    ),
  },
  {
    title: 'Date d’inscription',
    index: 'created_at',
    render: line => <Typography color={'text.disabled'}>{getFormattedDate(parseISO(line.created_at))}</Typography>,
  },
  {
    title: 'Abonnements',
  },
]
