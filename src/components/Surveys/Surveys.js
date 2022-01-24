import { useCallback, useState } from 'react'
import { useMutation } from 'react-query'
import { Container, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { getSurveysQuery, createOrUpdateSurveyQuery } from 'api/surveys'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyVariants } from 'components/shared/notification/constants'

import SurveyItem from './SurveyItem'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Loader from 'ui/Loader'
import PageHeader from 'ui/PageHeader'
import EditIcon from 'ui/icons/EditIcon'

const PageTitle = styled(Typography)`
  font-size: 24px;
  font-weight: 400;
  line-height: 36px;
`

const infiniteScrollStylesOverrides = {
  '& .infinite-scroll-component__outerdiv': {
    width: '100%',
  },
}

const messages = {
  pageTitle: 'Questionnaires',
  create: 'Créer un questionnaire local',
  publishSuccess: 'Questionnaire publié avec succès',
  unpublishSuccess: 'Questionnaire dépublié avec succès',
}

const Surveys = () => {
  const [, setIsCreateEditModalOpen] = useState(false)
  const [, setSurveyDetail] = useState()
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()

  const {
    data: paginatedSurveys = null,
    fetchNextPage: fetchNextPageSurveys,
    hasNextPage: hasNextPageSurveys,
    refetch: refetchSurveys,
  } = useInfiniteQueryWithScope('surveys', pageParams => getSurveysQuery(pageParams), {
    getNextPageParam,
    onError: handleError,
  })
  const surveys = usePaginatedData(paginatedSurveys)

  const { mutate: createOrUpdateSurvey } = useMutation(createOrUpdateSurveyQuery, {
    onSuccess: ({ published: isPublished }) => {
      enqueueSnackbar(isPublished ? messages.publishSuccess : messages.unpublishSuccess, notifyVariants.success)
      refetchSurveys()
    },
    onError: handleError,
  })

  const togglePublish = surveyId => () => {
    const { id, isPublished } = surveys.find(({ id }) => id === surveyId)
    createOrUpdateSurvey({ id, isPublished: !isPublished })
  }

  const handleUpdate = useCallback(
    surveyId => () => {
      const surveyDetail = surveys.find(({ id }) => id === surveyId)
      if (!surveyDetail) return
      setSurveyDetail(surveyDetail)
      setIsCreateEditModalOpen(true)
    },
    [surveys]
  )

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={<PageTitle sx={{ color: 'campaigncolor' }}>{messages.pageTitle}</PageTitle>}
          button={
            <PageHeaderButton
              label={messages.create}
              icon={<EditIcon sx={{ color: 'campaign.color', fontSize: '20px' }} />}
              onClick={() => {}}
            />
          }
        />
      </Grid>

      <Grid
        container
        justifyContent="space-between"
        data-cy="surveys-container"
        sx={{ pt: 4, ...infiniteScrollStylesOverrides }}
      >
        {surveys.length > 0 && (
          <InfiniteScroll
            dataLength={surveys.length}
            next={() => fetchNextPageSurveys()}
            hasMore={hasNextPageSurveys}
            loader={<Loader />}
          >
            <Grid container spacing={2} data-cy="surveys-list">
              {surveys.map(survey => (
                <SurveyItem
                  key={survey.id}
                  isPublished={survey.isPublished}
                  title={survey.title}
                  author={survey.author}
                  questionsCount={survey.questionsCount}
                  answersCount={survey.answersCount}
                  handleView={() => {}}
                  handlePublish={togglePublish(survey.id)}
                  handleUpdate={handleUpdate(survey.id)}
                />
              ))}
            </Grid>
          </InfiniteScroll>
        )}
      </Grid>
    </Container>
  )
}

export default Surveys
