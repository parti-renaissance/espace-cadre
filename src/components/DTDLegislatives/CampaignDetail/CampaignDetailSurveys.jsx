import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { Grid } from '@mui/material'
import { orderBy } from 'lodash'

import SurveysTable from 'ui/Table'
import Loading from 'components/Dashboard/shared/Loading'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { getDTDCampaignSurveysReplies } from 'api/DTD'
import { useErrorHandler } from 'components/shared/error/hooks'

const messages = {
  called: 'Porte-à-porteur',
  time: 'Date (Temps)',
  anonymous: 'Anonyme',
  years: 'ans',
  gender: 'Genre',
  ageRange: "Tranche d'âge",
  profession: 'Profession',
  firstName: 'Prénom',
  lastName: 'Nom',
  emailAddress: 'Email',
  postalCode: 'Code postal',
}

const CampaignDetailSurveys = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [order, toggleOrder] = useState({ startDate: 'asc' })
  const { handleError } = useErrorHandler()
  const { campaignId } = useParams()

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

  const { data: surveys = {}, isLoading: isSurveysLoading } = useQueryWithScope(
    [
      'surveys-detail',
      { feature: 'DTD', view: 'CampaignDetailSurveys', pageNumber: currentPage, pageSize: rowsPerPage },
      campaignId,
    ],
    () => getDTDCampaignSurveysReplies({ campaignId, pageSize: rowsPerPage, pageNumber: currentPage }),
    {
      onError: handleError,
    }
  )
  const surveysTotalCount = surveys?.totalCount
  const replies = surveys?.replies

  const columns = useMemo(() => replies?.[0]?.answers.map(({ question, type }) => ({ question, type })), [replies])
  const rows = useMemo(
    () => orderBy(replies, Object.keys(order).reverse(), Object.values(order).reverse()),
    [replies, order]
  )

  if (replies?.length === 0) return null
  if (isSurveysLoading) return <Loading />

  return (
    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} data-cy="campaign-campaign-detail-surveys">
      <SurveysTable
        columns={columns}
        order={order}
        handleSort={handleSort}
        rows={rows}
        messages={messages}
        surveysTotalCount={surveysTotalCount}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        isDTD={true}
      />
    </Grid>
  )
}

export default CampaignDetailSurveys
