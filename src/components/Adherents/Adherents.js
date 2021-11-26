import { useState, useEffect } from 'react'
import { Container, Table, TableContainer, TablePagination, Paper, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import TableHeadComponent from './TableHeadComponent'
import TableBodyComponent from './TableBodyComponent'
import Loader from 'ui/Loader'
import DynamicFilters from '../Filters/DynamicFilters'
import { getAdherents, getColumns } from 'api/adherents'
import PaginatedResult from 'api/paginatedResult'
import UIContainer from 'ui/Container'
import PageTitle from 'ui/PageTitle'

export const FEATURE_ADHERENTS = 'contacts'

const useStyles = makeStyles({
  tableContainer: {
    fontSize: '12px',
    borderRadius: '12px',
    height: '70vh',
  },
  adherentsContainer: {
    padding: '0',
    marginBottom: '16px',
  },
  rounded: {
    borderRadius: '12px',
  },
})

const messages = {
  title: 'Adhérents',
}

function Adherents() {
  const classes = useStyles()
  const [columnsTitle, setColumnsTitle] = useState([])
  const [adherents, setAdherents] = useState(new PaginatedResult([], 0, 0, 0, 0, 0))
  const [defaultFilter, setDefaultFilter] = useState({ page: 1, zones: [] })
  const [filters, setFilters] = useState(defaultFilter)

  useEffect(() => {
    getColumns(setColumnsTitle)
  }, [])

  useEffect(() => {
    const filter = { ...filters, zones: filters.zones.map(z => z.uuid) }
    getAdherents(filter, setAdherents)
  }, [filters])

  const renderContent = () => {
    if (columnsTitle.length > 0) {
      return (
        <>
          <Grid container>
            <PageTitle breakpoints={{ xs: 12 }} title={messages.title} />
          </Grid>
          <DynamicFilters
            feature={FEATURE_ADHERENTS}
            values={defaultFilter}
            onSubmit={newFilters => setFilters({ ...newFilters, ...{ page: 1 } })}
            onReset={() => {
              setDefaultFilter({ page: 1, zones: [] })
              setFilters({ page: 1, zones: [] })
            }}
          />
          <Paper classes={{ rounded: classes.rounded }}>
            <TableContainer className={classes.tableContainer}>
              <Table stickyHeader>
                <TableHeadComponent columnsTitle={columnsTitle} />
                <TableBodyComponent members={adherents.data} columnsTitle={columnsTitle} />
              </Table>
            </TableContainer>
            {adherents.total && (
              <TablePagination
                rowsPerPageOptions={[100]}
                labelRowsPerPage="Lignes par page:"
                component="div"
                count={adherents.total || 0}
                page={filters.page - 1}
                onPageChange={(event, page) => setFilters(prevState => ({ ...prevState, ...{ page: page + 1 } }))}
                rowsPerPage={adherents.pageSize}
              />
            )}
          </Paper>
        </>
      )
    }

    return (
      <UIContainer textAlign="center">
        <Loader />
      </UIContainer>
    )
  }

  return (
    <Container maxWidth="xl" className={classes.adherentsContainer}>
      {renderContent()}
    </Container>
  )
}

export default Adherents
