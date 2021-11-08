import { useState, useEffect } from 'react'
import { Container, TableContainer, Paper, Table, TablePagination, makeStyles } from '@material-ui/core'
import qs from 'qs'
import { apiClient } from '../../services/networking/client'
import TableHeadComponent from './TableHeadComponent'
import TableBodyComponent from './TableBodyComponent'
import ErrorComponent from '../ErrorComponent'
import Loader from 'ui/Loader'
import DynamicFilters from '../Filters/DynamicFilters'
import { useColumnsTitleCache } from '../../redux/adherents/hooks'
import { FEATURE_ADHERENTS } from '../Feature/FeatureCode'

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
  const [columnsTitle, setColumnsTitle] = useColumnsTitleCache()
  const [adherents, setAdherents] = useState([])
  const [errorMessage, setErrorMessage] = useState()
  const [filters, setFilters] = useState({ page: 1 })
  const classes = useStyles()

  useEffect(() => {
    if (columnsTitle.length) {
      return
    }
    const getColumnsTitle = async () => {
      try {
        setColumnsTitle(await apiClient.get('v3/adherents/columns'))
      } catch (error) {
        setErrorMessage(error)
      }
    }

    getColumnsTitle()
  }, [columnsTitle, setColumnsTitle])

  useEffect(() => {
    const getAdherents = async () => {
      try {
        setAdherents(await apiClient.get(`v3/adherents?${qs.stringify(filters)}`))
      } catch (error) {
        setErrorMessage(error)
      }
    }
    getAdherents()
  }, [filters])

  const renderContent = () => {
    if (columnsTitle.length > 0) {
      return (
        <>
          <DynamicFilters
            feature={FEATURE_ADHERENTS}
            values={filters}
            onSubmit={newFilters => setFilters({ ...newFilters, ...{ page: 1 } })}
            onReset={() => {
              setFilters({ page: 1 })
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
