import PropTypes from 'prop-types'
import { useMemo, useState } from 'react'
import { Grid } from '@mui/material'
import { orderBy } from 'lodash'
import SurveysTable from 'ui/Table'

import { PhoningCampaignDetailSurveysReply as DomainPhoningCampaignDetailSurveysReply } from 'domain/phoning'

const messages = {
  called: 'Appelé',
  time: 'Date (Temps)',
  anonymous: 'Anonyme',
  years: 'ans',
}

const CampaignDetailSurveys = ({ replies }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [order, toggleOrder] = useState({ startDate: 'asc' })

  const handleChangePage = (_, page) => {
    setCurrentPage(page)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setCurrentPage(0)
  }

  const handleSort = column => () => {
    toggleOrder(order => ({ ...order, [column]: order[column] === 'asc' ? 'desc' : 'asc' }))
  }

  const columns = useMemo(() => replies?.[0]?.answers.map(({ question, type }) => ({ question, type })), [replies])
  const rows = useMemo(() => {
    const rows = replies.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
    return orderBy(rows, Object.keys(order).reverse(), Object.values(order).reverse())
  }, [replies, currentPage, rowsPerPage, order])

  if (replies.length === 0) return null

  return (
    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} data-cy="phoning-campaign-detail-surveys">
      <SurveysTable
        columns={columns}
        order={order}
        handleSort={handleSort}
        rows={rows}
        messages={messages}
        surveysTotalCount={replies.length}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        isDTD={false}
      />
    </Grid>
  )
}

CampaignDetailSurveys.propTypes = {
  replies: PropTypes.arrayOf(PropTypes.shape(DomainPhoningCampaignDetailSurveysReply.propTypes)).isRequired,
}

export default CampaignDetailSurveys
