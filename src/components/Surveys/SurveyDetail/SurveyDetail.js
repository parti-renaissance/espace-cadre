import { useState } from 'react'
import { useParams } from 'react-router'
import { Container, Grid, Typography } from '@mui/material'

import { getSurveyQuery, getSurveyRepliesQuery } from 'api/surveys'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { useErrorHandler } from 'components/shared/error/hooks'
import SurveyDetailReplies from './SurveyDetailReplies'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import PageHeader from 'ui/PageHeader'
import EditIcon from 'ui/icons/EditIcon'
import { Link } from 'react-router-dom'
import paths from 'shared/paths'

const messages = {
  pageTitle: 'Questionnaires',
  modify: 'modifier',
}

export const SurveyDetail = () => {
  const [, setIsCreateEditModalOpen] = useState(false)
  const { surveyId } = useParams()
  const { handleError } = useErrorHandler()

  const { data: surveyDetail = {} } = useQueryWithScope(
    ['surveys', { view: 'feature-detail' }, surveyId],
    () => getSurveyQuery(surveyId),
    {
      onError: handleError,
    }
  )

  const { data: surveyReplies = [], isLoading: isSurveyRepliesLoading } = useQueryWithScope(
    ['replies', surveyId],
    () => getSurveyRepliesQuery(surveyId),
    {
      onError: handleError,
    }
  )

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={
            <>
              <Typography variant="pageTitle" sx={{ color: 'campaign.color' }}>
                <Link to={paths.survey}>{messages.pageTitle}</Link>
              </Typography>
              <Typography variant="pageTitle" sx={{ color: 'gray400' }}>
                &nbsp;{'>'}&nbsp;
              </Typography>
              <Typography variant="pageTitle" sx={{ color: 'gray800' }}>
                {surveyDetail.title}
              </Typography>
            </>
          }
          button={
            <PageHeaderButton
              label={messages.modify}
              icon={<EditIcon sx={{ color: 'campaign.color', fontSize: '20px' }} />}
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
    </Container>
  )
}

export default SurveyDetail
