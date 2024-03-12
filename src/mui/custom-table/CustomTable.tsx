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
import { useCallback, useMemo } from 'react'
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

/**
 * Generate a table from definition, type of columns is inferred from data structure
 * @param data any data as array, undefined or null is not authorised but empty array are.
 * @param columns column definitions, only "id" index is mandatory. Can take a render entry which customize the render of this cell, otherwise it render as text without Typography element ( i.e : [{
 *         title: 'ID',
 *         index: 'id',
 *         width: 150,
 *         render: value => <strong>{value.id}</strong>,
 *       },] )
 * @param onRowsPerPageChange
 * @param onPageChange
 * @param sx
 * @param rowsPerPage
 * @param rowsPerPageOptions
 * @param isLoading show skeleton while loading
 * @param page
 * @constructor
 */
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
  // Reduce column definition in a map for quick access, object is indexed by "index" in array, not the index of row in array
  const columnsDefinition: Map<string, CustomTableColumnModel<DataType>> = useMemo(
    () =>
      new Map(
        Object.entries(
          columns.reduce(
            (acc, currentValue) => ({
              ...acc,
              [currentValue.index]: currentValue,
            }),
            {}
          )
        )
      ),
    [columns]
  )

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
                {Object.keys(el).map(key => {
                  const RenderCell = columnsDefinition.get(key)?.render

                  return <TableCell key={key}>{RenderCell ? <RenderCell {...el} /> : el[key]}</TableCell>
                })}
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
