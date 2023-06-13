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
import { nationalScopes } from 'shared/scopes'
import { useUserScope } from '../../../redux/user/hooks'
import { getCurrentUser } from '../../../redux/user/selectors'
import { useSelector } from 'react-redux'

const messages = {
  pageTitle: 'Questionnaires',
  modify: 'modifier',
  local: 'local',
  national: 'national',
}

export const SurveyDetail = () => {
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const { surveyId } = useParams()
  const { handleError } = useErrorHandler()
  const [currentScope] = useUserScope()
  const currentUser = useSelector(getCurrentUser)
  const isLocal = !nationalScopes.includes(currentScope.code)
  const isNational = nationalScopes.includes(currentScope.code)
  const loggedUser = `${currentUser.firstName} ${currentUser.lastName}`

  const { data: surveyDetail = null, refetch: refetchSurvey } = useQueryWithScope(
    ['survey-detail', { feature: 'Surveys', view: 'SurveyDetail' }, surveyId],
    () => getOneSurveyQuery(surveyId),
    {
      onError: handleError,
    }
  )
  const surveyAuthor = `${surveyDetail?.creator?.firstName} ${surveyDetail?.creator?.lastName}`

  const { data: surveyReplies = [], isLoading: isSurveyRepliesLoading } = useQueryWithScope(
    ['survey-replies', { feature: 'Surveys', view: 'SurveyDetail' }, surveyId],
    () => getSurveyRepliesQuery(surveyId),
    {
      onError: handleError,
    }
  )
  const isButtonVisible =
    (isLocal && surveyAuthor === loggedUser && surveyDetail?.type === messages.local) ||
    (isNational && surveyAuthor === loggedUser && surveyDetail?.type === messages.national)

  if (!surveyDetail) {
    return null
  }

  return (
    <Container maxWidth={false} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.pageTitle}
          titleLink={paths.survey}
          titleSuffix={surveyDetail.title}
          button={
            isButtonVisible && (
              <PageHeaderButton
                label={messages.modify}
                icon={<EditIcon sx={{ color: 'main', fontSize: '20px' }} />}
                onClick={() => (Object.keys(surveyDetail).length > 0 ? setIsCreateEditModalOpen(true) : null)}
                isMainButton
              />
            )
          }
        />
      </Grid>

      <Grid container justifyContent="space-between" sx={{ pt: 2 }}>
        {!isSurveyRepliesLoading && (
          <Grid container spacing={2}>
            <SurveyDetailReplies survey={surveyDetail} replies={surveyReplies} />
          </Grid>
        )}
      </Grid>

      {isCreateEditModalOpen && (
        <CreateEdit
          survey={surveyDetail}
          onCreateResolve={refetchSurvey}
          handleClose={() => setIsCreateEditModalOpen(null)}
        />
      )}
    </Container>
  )
}

export default SurveyDetail
