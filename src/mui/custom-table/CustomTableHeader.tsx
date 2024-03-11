import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material'
import { Box } from '@mui/system'
import { visuallyHidden } from '@mui/utils'
import { ChangeEvent } from 'react'
import { CustomTableColumnModel, OrderEnum, RowWithIdModel } from '~/mui/custom-table/CustomTable.model'

interface Props<DataType extends RowWithIdModel> {
  order?: OrderEnum
  orderBy?: string
  headLabels: CustomTableColumnModel<DataType>[]
  rowCount?: number
  numSelected?: number
  onSort?: (id: string) => void
  onSelectAllRows?: (checked: boolean) => void
}

export default function CustomTableHeader<DataType extends RowWithIdModel>({
  order,
  orderBy,
  rowCount = 0,
  headLabels,
  numSelected = 0,
  onSort,
  onSelectAllRows,
}: Props<DataType>) {
  return (
    <TableHead>
      <TableRow>
        {onSelectAllRows && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={!!numSelected && numSelected < rowCount}
              checked={!!rowCount && numSelected === rowCount}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSelectAllRows(event.target.checked)}
            />
          </TableCell>
        )}

        {headLabels.map(headCell => (
          <TableCell
            key={headCell.index as string}
            align={headCell.align ?? 'left'}
            sortDirection={orderBy === headCell.index ? order : false}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            {onSort ? (
              <TableSortLabel
                hideSortIcon
                active={orderBy === headCell.index}
                direction={orderBy === headCell.index ? order : 'asc'}
                onClick={() => onSort(headCell.index as string)}
              >
                {headCell.title}

                {orderBy === headCell.index ? (
                  <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.title
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
