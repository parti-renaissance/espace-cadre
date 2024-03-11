import {
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Theme,
  Typography,
} from '@mui/material'
import { SxProps } from '@mui/system'
import generateFixedArray from '~/utils/generateFixedArray'
import pluralize from '~/components/shared/pluralize/pluralize'
import { useCallback } from 'react'
import { CustomTableColumnModel, RowWithIdModel } from '~/mui/custom-table/CustomTable.model'
import CustomTableHeader from '~/mui/custom-table/CustomTableHeader'

export interface TableProps<DataType extends RowWithIdModel> {
  // Column order in definition is used to display, data can be shuffled and keys order doesn't matter
  columns: CustomTableColumnModel<DataType>[]
  data: DataType[]
  rowsPerPage?: number
  rowsPerPageOptions?: number[]
  page?: number
  onPageChange?: (nextPage: number) => void
  onRowsPerPageChange?: (rowsPerPage: number) => void
  sx?: SxProps<Theme>
  isLoading?: boolean
}

const LineSkeleton = () => <Skeleton sx={{ width: '100%', height: 50, mb: 1 }} />
const skeletonArray = generateFixedArray(10)

export default function CustomTable<DataType extends RowWithIdModel>({
  data,
  columns,
  onRowsPerPageChange,
  onPageChange,
  sx,
  rowsPerPage = 25,
  rowsPerPageOptions = [25, 50, 100],
  isLoading = false,
  page = 0,
}: TableProps<DataType>) {
  // TODO Generate a Map of columns for quick access to render functions and styles without using find on each cell

  const Pagination = useCallback(
    () => (
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, page) => onPageChange?.(page)}
        onRowsPerPageChange={ev => onRowsPerPageChange?.(Number(ev.target.value))}
      />
    ),
    [data.length, onPageChange, onRowsPerPageChange, rowsPerPage, rowsPerPageOptions, page]
  )

  return (
    <TableContainer sx={{ overflow: 'unset', ...sx }}>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        <Grid item xs={6}>
          <Typography>
            {pluralize(data.length, 'Résultat')} : <strong>{data.length}</strong>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Pagination />
        </Grid>
      </Grid>

      <Table>
        <CustomTableHeader headLabels={columns ?? []} />

        {isLoading ? (
          skeletonArray.map((_, index) => <LineSkeleton key={index} />)
        ) : (
          <TableBody>
            {data.map(el => (
              <TableRow key={el.id}>
                {Object.keys(el).map(key => (
                  <TableCell key={key}>{el[key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      <Pagination />
    </TableContainer>
  )
}

export const TableExample = () => (
  <CustomTable
    data={[
      { id: 1, name: 'Line 1' },
      { id: 2, name: 'line 2' },
    ]}
    columns={[
      {
        title: 'ID',
        index: 'id',
        width: 150,
        render: value => <strong>{value.id}</strong>,
      },
      {
        title: 'Nom',
        index: 'name',
      },
    ]}
  />
)
