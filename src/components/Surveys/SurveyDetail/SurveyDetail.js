import { useState } from 'react'
import { useParams } from 'react-router'
import { Container, Grid } from '@mui/material'

import { getOneSurveyQuery, getSurveyRepliesQuery } from 'api/surveys'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { useErrorHandler } from 'components/shared/error/hooks'
import SurveyDetailReplies from './SurveyDetailReplies'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import PageHeader from 'ui/PageHeader'
import EditIcon from 'ui/icons/EditIcon'
import paths from 'shared/paths'
import CreateEdit from '../CreateEdit/CreateEdit'

const messages = {
  pageTitle: 'Questionnaires',
  modify: 'modifier',
}

export const SurveyDetail = () => {
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const { surveyId } = useParams()
  const { handleError } = useErrorHandler()

  const { data: surveyDetail = {} } = useQueryWithScope(
    ['survey-detail', { feature: 'Surveys', view: 'SurveyDetail' }, surveyId],
    () => getOneSurveyQuery(surveyId),
    {
      onError: handleError,
    }
  )

  const { data: surveyReplies = [], isLoading: isSurveyRepliesLoading } = useQueryWithScope(
    ['survey-replies', { feature: 'Surveys', view: 'SurveyDetail' }, surveyId],
    () => getSurveyRepliesQuery(surveyId),
    {
      onError: handleError,
    }
  )

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.pageTitle}
          titleLink={paths.survey}
          titleSuffix={surveyDetail.title}
          button={
            <PageHeaderButton
              label={messages.modify}
              icon={<EditIcon sx={{ color: 'main', fontSize: '20px' }} />}
              onClick={() => (Object.keys(surveyDetail).length > 0 ? setIsCreateEditModalOpen(true) : null)}
            />
          }
        />
      </Grid>

      <Grid container justifyContent="space-between" sx={{ pt: 2 }}>
        {!isSurveyRepliesLoading && surveyReplies.length > 0 && (
          <Grid container spacing={2}>
            <SurveyDetailReplies surveyTitle={surveyDetail.title} replies={surveyReplies} />
          </Grid>
        )}
      </Grid>

      {isCreateEditModalOpen && (
        <CreateEdit
          survey={surveyDetail}
          onCreateResolve={() => {}}
          handleClose={() => setIsCreateEditModalOpen(null)}
        />
      )}
    </Container>
  )
}

export default SurveyDetail
