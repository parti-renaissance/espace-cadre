import {
  Grid,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableContainerProps,
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
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Scrollbar from '~/mui/scrollbar'

export interface TableProps<DataType extends RowWithIdModel> extends TableContainerProps {
  columns: CustomTableColumnModel<DataType>[]
  data: DataType[]
  rowsPerPage?: number
  rowsPerPageOptions?: number[]
  page?: number
  onPageChange?: (nextPage: number) => void
  onRowsPerPageChange?: (rowsPerPage: number) => void
  sx?: SxProps<Theme>
  tableSx?: SxProps<Theme>
  isLoading?: boolean
  total?: number
}

const LineSkeleton = ({ columns }: { columns: unknown[] }) => (
  <TableRow>
    <TableCell colSpan={columns.length}>
      <Skeleton sx={{ width: '100%', height: 50, mb: 1 }} data-testid="skeleton" />
    </TableCell>
  </TableRow>
)

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
 * @param tableSx
 * @param total
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
  tableSx,
  total = 0,
  rowsPerPage = 25,
  rowsPerPageOptions = [25, 50, 100],
  isLoading = false,
  page = 1,
  ...rest
}: TableProps<DataType>) {
  const Pagination = useCallback(
    () => (
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={(_, page) => onPageChange?.(page + 1)}
        onRowsPerPageChange={ev => {
          onRowsPerPageChange?.(Number(ev.target.value))
        }}
      />
    ),
    [onPageChange, onRowsPerPageChange, rowsPerPage, rowsPerPageOptions, page, total]
  )

  return (
    <TableContainer sx={{ overflow: 'unset', ...sx }} {...rest}>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        <Grid item xs={2}>
          <Typography>
            {pluralize(total, 'Résultat')} : <strong data-testid="result-count">{total}</strong>
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Pagination />
        </Grid>
      </Grid>

      <Scrollbar>
        <Table sx={tableSx}>
          <CustomTableHeader headLabels={columns ?? []} />
          <TableBody>
            {isLoading
              ? skeletonArray.map((_, index) => <LineSkeleton key={index} columns={columns} />)
              : data.map(el => (
                  <TableRow key={el.id}>
                    {columns
                      .filter(col => col.hidden === false || col.hidden === undefined)
                      .map(col => {
                        const key = `${String(col.index ?? col.title)}-${el.id}`

                        if (!col.index) {
                          return <TableCell key={key}>{col.render?.(el)}</TableCell>
                        }

                        if (col.index && !col.render) {
                          return (
                            <TableCell key={key}>
                              <>{el[col.index]}</>
                            </TableCell>
                          )
                        }

                        return <TableCell key={key}>{col.render?.(el)}</TableCell>
                      })}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </Scrollbar>

      <Pagination />
    </TableContainer>
  )
}

export const TableExample = () => (
  <CustomTable
    data={[
      { id: 1, name: 'Line 1' },
      { id: 2, name: 'Line 2' },
    ]}
    columns={[
      {
        title: 'ID',
        subTitle: 'Lorem ipsum',
        index: 'id',
        width: 150,
        render: value => <strong>{value.id}</strong>,
      },
      {
        title: 'Nom',
        index: 'name',
        width: 200,
      },
      {
        title: 'Actions',
        width: 200,
        render: () => (
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        ),
      },
    ]}
  />
)
