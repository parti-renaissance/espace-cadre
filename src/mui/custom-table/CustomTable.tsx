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
import { formatToFrenchNumberString } from '~/utils/numbers'
import { fontWeight } from '~/theme/typography'

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
  headerSx?: SxProps<Theme>
  footerSx?: SxProps<Theme>
  isLoading?: boolean
  total?: number
  hover?: boolean
  onLineClick?: (line: DataType) => void
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
 * @param onRowsPerPageChange event when selected a new count of rows per page, take care of resetting page to 1 when done.
 * @param onPageChange
 * @param sx theme applied to global "TableContainer" (this component first level)
 * @param tableSx theme which only apply to html "table" element
 * @param headerSx theme which apply to header (count and pagination)
 * @param footerSx theme which apply to footer (pagination at the moment)
 * @param total
 * @param rowsPerPage
 * @param rowsPerPageOptions
 * @param isLoading show skeleton while loading
 * @param page
 * @param hover enable hovering grey background
 * @param onLineClick line click handler, the cursor turn to pointer style when specified
 * @param rest @see MUI's TableContainer documentation
 * @constructor
 */
export default function CustomTable<DataType extends RowWithIdModel>({
  data,
  columns,
  onRowsPerPageChange,
  onPageChange,
  sx,
  tableSx,
  headerSx,
  footerSx,
  total = 0,
  rowsPerPage = 100,
  rowsPerPageOptions = [100, 50, 25],
  isLoading = false,
  page = 1,
  hover = true,
  onLineClick,
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
      <Grid container spacing={2} sx={{ alignItems: 'center', ...headerSx }}>
        <Grid item xs={2}>
          <Typography fontWeight={400}>
            <Typography color={'text.secondary'}>{pluralize(total, 'Résultat')} : </Typography>
            <Typography fontWeight={fontWeight.medium} data-testid="result-count">
              {formatToFrenchNumberString(total)}
            </Typography>
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
                  <TableRow
                    hover={hover}
                    key={el.id}
                    onClick={() => onLineClick?.(el)}
                    sx={{ cursor: onLineClick ? 'pointer' : 'inherit' }}
                  >
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

      <Grid sx={footerSx}>
        <Pagination />
      </Grid>
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
