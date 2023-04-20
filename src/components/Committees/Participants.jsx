import { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableSortLabel,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
} from '@mui/material'
import { styled } from '@mui/system'
import { v1 as uuid } from 'uuid'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { visuallyHidden } from '@mui/utils'
import { getVoters } from 'api/designations'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { useErrorHandler } from 'components/shared/error/hooks'
import { TruncatedText } from 'components/shared/styled'
import Loader from 'ui/Loader/Loader'

const ColumnLabel = styled(({ isTruncated = false, ...props }) =>
  isTruncated ? <TruncatedText variant="subtitle2" {...props} /> : <Typography variant="subtitle2" {...props} />
)(
  ({ theme }) => `
	color: ${theme.palette.colors.gray[800]};
	font-weight: 600;
`
)

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) return -1
  if (b[orderBy] > a[orderBy]) return 1
  return 0
}

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

const getComparator = (order, orderBy) =>
  order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy)

const DEFAULT_ORDER = 'asc'
const DEFAULT_ORDER_BY = 'voted_at'
const DEFAULT_ROWS_PER_PAGE = 10

const Participants = ({ designationId }) => {
  const { handleError } = useErrorHandler()
  const [order, setOrder] = useState(DEFAULT_ORDER)
  const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY)
  const [page, setPage] = useState(0)
  const [visibleRows, setVisibleRows] = useState(null)
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE)

  const { data: voters, isLoading } = useQueryWithScope(
    ['committee-designation-voters', { feature: 'Committees', view: 'DetailCommittee' }, designationId],
    () => getVoters(designationId),
    {
      onError: handleError,
      enabled: designationId !== null,
    }
  )

  useEffect(() => {
    let rowsOnMount = stableSort(voters, getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY))

    rowsOnMount = rowsOnMount.slice(0 * DEFAULT_ROWS_PER_PAGE, 0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE)

    setVisibleRows(rowsOnMount)
  }, [voters])

  const handleRequestSort = useCallback(
    (event, newOrderBy) => {
      const isAsc = orderBy === newOrderBy && order === 'asc'
      const toggledOrder = isAsc ? 'desc' : 'asc'
      setOrder(toggledOrder)
      setOrderBy(newOrderBy)

      const sortedRows = stableSort(voters, getComparator(toggledOrder, newOrderBy))
      const updatedRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

      setVisibleRows(updatedRows)
    },
    [order, orderBy, page, rowsPerPage, voters]
  )

  const handleChangePage = useCallback(
    (event, newPage) => {
      setPage(newPage)

      const sortedRows = stableSort(voters, getComparator(order, orderBy))
      const updatedRows = sortedRows.slice(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage)

      setVisibleRows(updatedRows)
    },
    [order, orderBy, voters, rowsPerPage]
  )

  const handleChangeRowsPerPage = useCallback(
    event => {
      const updatedRowsPerPage = parseInt(event.target.value, 10)
      setRowsPerPage(updatedRowsPerPage)

      setPage(0)

      const sortedRows = stableSort(voters, getComparator(order, orderBy))
      const updatedRows = sortedRows.slice(0 * updatedRowsPerPage, 0 * updatedRowsPerPage + updatedRowsPerPage)

      setVisibleRows(updatedRows)
    },
    [order, orderBy, voters]
  )

  if (isLoading) {
    return <Loader isCenter />
  }

  return (
    <Box>
      <Paper sx={{ borderRadius: 3 }}>
        <TableContainer sx={{ borderRadius: 3 }}>
          <Table sx={{ borderCollapse: 'separate' }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  key={uuid()}
                  sortDirection={orderBy === 'last_name' ? order : false}
                  onClick={event => handleRequestSort(event, 'last_name')}
                >
                  <TableSortLabel>
                    Participant
                    {orderBy === 'last_name' ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  key={uuid()}
                  sortDirection={orderBy === 'voted_at' ? order : false}
                  onClick={event => handleRequestSort(event, 'voted_at')}
                >
                  <TableSortLabel>
                    Date du vote
                    {orderBy === 'voted_at' ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell key={uuid()}>
                  <ColumnLabel>Code postal</ColumnLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows
                ? visibleRows.map(voter => (
                    <TableRow key={uuid()}>
                      <TableCell key={uuid()}>
                        <Typography sx={{ display: 'flex', alignItems: 'center' }} className="space-x-2">
                          <span>{voter.first_name}</span>
                          <span className="font-bold">{voter.last_name}</span>
                        </Typography>
                      </TableCell>
                      <TableCell key={uuid()}>
                        <Typography sx={{ color: 'colors.gray.500' }}>
                          {voter.voted_at && format(new Date(voter.voted_at), 'dd MMMM yyyy à hh:mm', { locale: fr })}
                          {!voter.voted_at && '--'}
                        </Typography>
                      </TableCell>
                      <TableCell key={uuid()}>
                        <Typography sx={{ color: 'colors.gray.500' }}>{voter.postal_code}</Typography>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={voters.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}

export default Participants

Participants.propTypes = {
  designationId: PropTypes.string.isRequired,
}
