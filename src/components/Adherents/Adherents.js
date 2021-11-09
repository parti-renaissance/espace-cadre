import { useState, useEffect } from 'react'
import { Container, TableContainer, Paper, Table, TablePagination, makeStyles } from '@material-ui/core'
import TableHeadComponent from './TableHeadComponent'
import TableBodyComponent from './TableBodyComponent'
import ErrorComponent from '../ErrorComponent'
import Loader from 'ui/Loader'
import DynamicFilters from '../Filters/DynamicFilters'
import { getAdherents, getColumns } from 'api/adherents'

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

function Adherents() {
  const [columnsTitle, setColumnsTitle] = useState([])
  const [adherents, setAdherents] = useState([])
  const [errorMessage, setErrorMessage] = useState()
  const [defaultFilter, setDefaultFilter] = useState({ page: 1, zones: [] })
  const [filters, setFilters] = useState(defaultFilter)
  const classes = useStyles()

  useEffect(() => {
    const getColumnsTitle = async () => {
      await getColumns(setColumnsTitle)
    }
    getColumnsTitle()
  }, [])

  useEffect(() => {
    const fetchAdherents = async () => {
      try {
        const filter = { ...filters, zones: filters.zones.map(z => z.uuid) }
        //setAdherents(await apiClient.get(`v3/adherents?${qs.stringify(filter)}`))
        await getAdherents(filter, setAdherents)
      } catch (error) {
        setErrorMessage(error)
      }
    }
    fetchAdherents()
  }, [filters])

  const renderContent = () => {
    if (columnsTitle.length > 0) {
      return (
        <>
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
                <TableBodyComponent adherents={adherents} columnsTitle={columnsTitle} />
              </Table>
            </TableContainer>
            {adherents.metadata && (
              <TablePagination
                rowsPerPageOptions={[100]}
                labelRowsPerPage="Lignes par page:"
                component="div"
                count={adherents.metadata.total_items || 0}
                page={filters.page - 1}
                onPageChange={(event, page) => setFilters(prevState => ({ ...prevState, ...{ page: page + 1 } }))}
                rowsPerPage={adherents.metadata.items_per_page}
              />
            )}
          </Paper>
        </>
      )
    }
    if (errorMessage) {
      return <ErrorComponent errorMessage={errorMessage} />
    }
    return (
      <div style={{ textAlign: 'center' }} className="with-background dc-container">
        <Loader />
      </div>
    )
  }

  return (
    <Container maxWidth="xl" className={classes.adherentsContainer}>
      {renderContent()}
    </Container>
  )
}

export default Adherents
