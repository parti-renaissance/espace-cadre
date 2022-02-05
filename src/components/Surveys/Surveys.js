import { useState } from 'react'
import { generatePath, useNavigate } from 'react-router'
import { useMutation } from 'react-query'
import { Container, Grid, Typography } from '@mui/material'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useInfiniteQueryWithScope, useQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { getSurveysQuery, getOneSurveyQuery, createOrUpdateSurveyQuery } from 'api/surveys'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { useUserScope } from '../../redux/user/hooks'
import { scopesVisibility, visibility } from './shared/constants'
import SurveyItem from './SurveyItem'
import CreateEdit from './CreateEdit/CreateEdit'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Loader from 'ui/Loader'
import PageHeader from 'ui/PageHeader'
import EditIcon from 'ui/icons/EditIcon'

const infiniteScrollStylesOverrides = {
  '& .infinite-scroll-component__outerdiv': {
    width: '100%',
  },
}

const messages = {
  pageTitle: 'Questionnaires',
  create: 'Créer un questionnaire',
  publishSuccess: 'Questionnaire publié avec succès',
  unpublishSuccess: 'Questionnaire dépublié avec succès',
}

const Surveys = () => {
  const [currentScope] = useUserScope()
  const { code: scope } = currentScope
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [surveyIdToUpdate, setSurveyIdToUpdate] = useState()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()

  const {
    data: paginatedSurveys = null,
    fetchNextPage: fetchNextPageSurveys,
    hasNextPage: hasNextPageSurveys,
    refetch: refetchSurveys,
  } = useInfiniteQueryWithScope(['surveys', { view: 'feature' }], pageParams => getSurveysQuery(pageParams), {
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

  const { data: surveyDetail = {} } = useQueryWithScope(
    ['Surveys', 'Surveys', surveyIdToUpdate],
    () => getOneSurveyQuery(surveyIdToUpdate),
    {
      enabled: !!surveyIdToUpdate,
      onSuccess: () => {
        setIsCreateEditModalOpen(true)
      },
      onError: handleError,
    }
  )

  const togglePublish = surveyId => () => {
    const { id, isPublished } = surveys.find(({ id }) => id === surveyId)
    createOrUpdateSurvey({ id, isPublished: !isPublished })
  }

  const handleView = surveyId => () => {
    navigate(generatePath('/questionnaires/:surveyId', { surveyId }))
  }

  const handleUpdate = surveyId => () => {
    setSurveyIdToUpdate(surveyId)
  }

  const handleClose = () => {
    setSurveyIdToUpdate(undefined)
    setIsCreateEditModalOpen(false)
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.pageTitle}
          button={
            <PageHeaderButton
              label={
                <Typography variant="button">
                  {messages.create}
                  &nbsp;
                  {scopesVisibility[scope] === visibility.local && visibility.local}
                  {scopesVisibility[scope] === visibility.national && visibility.national}
                </Typography>
              }
              icon={<EditIcon sx={{ color: 'campaign.color', fontSize: '20px' }} />}
              onClick={() => setIsCreateEditModalOpen(true)}
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
                  handleView={handleView(survey.id)}
                  handlePublish={togglePublish(survey.id)}
                  handleUpdate={handleUpdate(survey.id)}
                />
              ))}
            </Grid>
          </InfiniteScroll>
        )}
      </Grid>

      {isCreateEditModalOpen && (
        <CreateEdit
          survey={Object.keys(surveyDetail).length > 0 ? surveyDetail : null}
          onCreateResolve={refetchSurveys}
          handleClose={handleClose}
        />
      )}
    </Container>
  )
}

export default Surveys
