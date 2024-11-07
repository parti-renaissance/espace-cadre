import { useMemo, useState } from 'react'
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
import { visuallyHidden } from '@mui/utils'
import { orderBy } from 'lodash'
import { getVoters } from '~/api/designations'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { TruncatedText } from '~/components/shared/styled'
import Loader from '~/ui/Loader/Loader'
import UIInputLabel from '~/ui/InputLabel/InputLabel'
import Input from '~/ui/Input/Input'
import { formatDate } from '~/shared/helpers'

const ColumnLabel = styled(({ isTruncated = false, ...props }) =>
  isTruncated ? <TruncatedText variant="subtitle2" {...props} /> : <Typography variant="subtitle2" {...props} />
)(
  ({ theme }) => `
	color: ${theme.palette.colors.gray[800]};
	font-weight: 600;
`
)

const DEFAULT_SORT = 'voted_at'
const DEFAULT_ORDER = 'asc'
const DEFAULT_ROWS_PER_PAGE = 25

const Participants = ({ designationId }) => {
  const { handleError } = useErrorHandler()
  const [pageConfig, setPageConfig] = useState({
    search: '',
    sort: DEFAULT_SORT,
    order: DEFAULT_ORDER,
    nbPerPage: DEFAULT_ROWS_PER_PAGE,
    page: 0,
  })
  const { data: voters, isLoading } = useQueryWithScope(
    ['committee-designation-voters', { feature: 'Committees', view: 'DetailCommittee' }, designationId],
    () => getVoters(designationId),
    {
      onError: handleError,
      enabled: designationId !== null,
    }
  )

  const sortedVoters = useMemo(() => {
    if (!voters) {
      return []
    }

    let results = voters.filter(
      voter => voter.last_name.startsWith(pageConfig.search) || voter.first_name.startsWith(pageConfig.search)
    )

    return orderBy(results, [pageConfig.sort], [pageConfig.order]).slice(
      pageConfig.page * pageConfig.nbPerPage,
      pageConfig.page * pageConfig.nbPerPage + pageConfig.nbPerPage
    )
  }, [voters, pageConfig])

  if (isLoading) {
    return <Loader isCenter />
  }

  return (
    <Box>
      <Paper sx={{ borderRadius: 3 }}>
        {sortedVoters.length > 0 && (
          <Box sx={{ mb: 1.5, p: 2, borderBottom: '1px solid', borderBottomColor: 'colors.gray.200' }}>
            <UIInputLabel>Rechercher par nom</UIInputLabel>
            <Input
              name="search"
              onChange={event =>
                setPageConfig(prevState => ({
                  ...prevState,
                  search: event.target.value,
                }))
              }
              value={pageConfig.search}
              autoFocus
              sx={{ maxWidth: '32rem' }}
            />
          </Box>
        )}
        <TableContainer sx={{ borderRadius: 3 }}>
          <Table sx={{ borderCollapse: 'separate' }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  key={uuid()}
                  sortDirection={pageConfig.sort === 'last_name' ? pageConfig.order : false}
                  onClick={() =>
                    setPageConfig(prevState => ({
                      ...prevState,
                      page: prevState.sort !== 'last_name' || prevState.order === 'asc' ? 0 : prevState.page,
                      sort: 'last_name',
                      order: prevState.sort === 'last_name' && prevState.order === 'asc' ? 'desc' : 'asc',
                    }))
                  }
                >
                  <TableSortLabel active={pageConfig.sort === 'last_name'}>
                    Participant
                    {pageConfig.sort === 'last_name' ? (
                      <Box component="span" sx={visuallyHidden}>
                        {pageConfig.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  key={uuid()}
                  sortDirection={pageConfig.sort === 'voted_at' ? pageConfig.order : false}
                  onClick={() =>
                    setPageConfig(prevState => ({
                      ...prevState,
                      page: prevState.sort !== 'voted_at' || prevState.order === 'asc' ? 0 : prevState.page,
                      sort: 'voted_at',
                      order: prevState.sort === 'voted_at' && prevState.order === 'asc' ? 'desc' : 'asc',
                    }))
                  }
                >
                  <TableSortLabel active={pageConfig.sort === 'voted_at'}>
                    Date du vote
                    {pageConfig.sort === 'voted_at' ? (
                      <Box component="span" sx={visuallyHidden}>
                        {pageConfig.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
              {sortedVoters.length > 0 ? (
                sortedVoters.map(voter => (
                  <TableRow key={uuid()}>
                    <TableCell key={uuid()}>
                      <Typography sx={{ display: 'flex', alignItems: 'center' }} className="space-x-2">
                        <span>{voter.first_name}</span>
                        <span className="font-bold">{voter.last_name}</span>
                      </Typography>
                    </TableCell>
                    <TableCell key={uuid()}>
                      <Typography sx={{ color: 'colors.gray.500' }}>
                        {voter.voted_at && formatDate(voter.voted_at, 'dd MMMM yyyy à HH:mm')}
                        {!voter.voted_at && '--'}
                      </Typography>
                    </TableCell>
                    <TableCell key={uuid()}>
                      <Typography sx={{ color: 'colors.gray.500' }}>{voter.postal_code}</Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align={'center'}>
                    <Typography sx={{ color: 'colors.gray.500' }}>Aucun élément</Typography>
                  </TableCell>{' '}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={voters.length}
          rowsPerPage={pageConfig.nbPerPage}
          page={pageConfig.page}
          onPageChange={(event, page) => setPageConfig(prevState => ({ ...prevState, page }))}
          onRowsPerPageChange={event => setPageConfig(prevState => ({ ...prevState, nbPerPage: event.target.value }))}
          className="voter-pagination"
        />
      </Paper>
    </Box>
  )
}

export default Participants

Participants.propTypes = {
  designationId: PropTypes.string.isRequired,
}
