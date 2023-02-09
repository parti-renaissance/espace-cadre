import { useState } from 'react'
import { styled } from '@mui/system'
import { Container, Table, TableContainer as MuiTableContainer, TablePagination, Paper, Grid } from '@mui/material'
import TableHeadComponent from './TableHeadComponent'
import TableBodyComponent from './TableBodyComponent'
import Loader from 'ui/Loader'
import DynamicFilters from '../Filters/DynamicFilters'
import { getActivists, getColumns } from 'api/activist'
import { PaginatedResult } from 'api/pagination'
import UIContainer from 'ui/Container'
import PageTitle from 'ui/PageTitle'
import { useQueryWithScope } from 'api/useQueryWithScope'
import features from 'shared/features'

const TableContainer = styled(MuiTableContainer)`
  border-radius: 12px;
  height: 70vh;
`

const messages = {
  title: 'Militants',
}

const Activists = () => {
  const [defaultFilter, setDefaultFilter] = useState({ page: 1, zones: [] })
  const [filters, setFilters] = useState(defaultFilter)

  const { data: columnsTitle = [] } = useQueryWithScope(
    ['columns-title', { feature: 'Activists', view: 'Activists' }],
    getColumns
  )

  const { data: activists = new PaginatedResult([], 0, 0, 0, 0, 0) } = useQueryWithScope(
    ['activists', { feature: 'Activists', view: 'Activists' }, filters],
    () => {
      const filter = { ...filters, zones: filters.zones.map(z => z.uuid) }
      return getActivists(filter)
    }
  )

  if (columnsTitle.length === 0) {
    return (
      <UIContainer textAlign="center">
        <Loader />
      </UIContainer>
    )
  }

  return (
    <Container maxWidth={false}>
      <Grid container>
        <PageTitle breakpoints={{ xs: 12 }} title={messages.title} />
      </Grid>
      <DynamicFilters
        feature={features.contacts}
        values={defaultFilter}
        onSubmit={newFilters => setFilters({ ...newFilters, ...{ page: 1 } })}
        onReset={() => {
          setDefaultFilter({ page: 1, zones: [] })
          setFilters({ page: 1, zones: [] })
        }}
      />
      <Paper>
        <TableContainer>
          <Table stickyHeader>
            <TableHeadComponent columnsTitle={columnsTitle} />
            <TableBodyComponent members={activists.data} columnsTitle={columnsTitle} />
          </Table>
        </TableContainer>
        {activists.total && (
          <TablePagination
            rowsPerPageOptions={[100]}
            labelRowsPerPage="Lignes par page:"
            component="div"
            count={activists.total || 0}
            page={filters.page - 1}
            onPageChange={(event, page) => setFilters(prevState => ({ ...prevState, ...{ page: page + 1 } }))}
            rowsPerPage={activists.pageSize}
          />
        )}
      </Paper>
    </Container>
  )
}

export default Activists
