import { Card } from '@mui/material'
import CustomTable from '~/mui/custom-table/CustomTable'
import { ActivistModel } from '~/models/activist.model'
import { GenderEnum, PaginatedDataModel } from '~/models/common.model'
import { useMemo } from 'react'
import { fullName } from '~/utils/fullName'
import { getFormattedDate } from '~/utils/date'
import { parseISO } from 'date-fns'
import { compact } from 'lodash'

interface ActivistListProps {
  paginatedData?: PaginatedDataModel<ActivistModel>
  onPageChange?: (pageToFetch: number) => void
  page?: number
  perPage?: number
  onRowsPerPageChange?: (rowsPerPage: number) => void
}

export default function ActivistList({
  paginatedData,
  onPageChange,
  page,
  perPage,
  onRowsPerPageChange,
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
        data={mappedData ?? []}
        onPageChange={onPageChange}
        page={page}
        rowsPerPage={perPage}
        onRowsPerPageChange={onRowsPerPageChange}
        total={paginatedData?.metadata.total_items}
        columns={[
          {
            index: 'id',
            title: 'ID',
            hidden: true,
          },
          {
            title: 'Militants',
            subTitle: 'Âge, civilité',
            render: line => {
              const formattedText = compact([
                line.birthdate !== null ? getFormattedDate(parseISO(line.birthdate)) : undefined,
                line.gender === GenderEnum.MALE ? 'Monsieur' : 'Madame',
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
                <strong>{line.committee}</strong>
                <div>{line.city}</div>
              </>
            ),
          },
          {
            title: 'Date d’inscription',
            index: 'created_at',
            render: line => getFormattedDate(parseISO(line.created_at)),
          },
          {
            title: 'Abonnements',
          },
        ]}
      />
    </Card>
  )
}
