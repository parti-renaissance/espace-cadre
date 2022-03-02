import { useMemo, useState } from 'react'
import { generatePath, useNavigate } from 'react-router'
import { useMutation } from 'react-query'
import { Container, Grid, Tab as MuiTab, Tabs, Typography } from '@mui/material'
import InfiniteScroll from 'react-infinite-scroll-component'
import { styled } from '@mui/system'

import { useInfiniteQueryWithScope, useQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { getSurveysQuery, getOneSurveyQuery, createOrUpdateSurveyQuery } from 'api/surveys'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { notifyVariants } from 'components/shared/notification/constants'
import { useUserScope } from '../../redux/user/hooks'
import { scopesVisibility, visibility } from './shared/constants'
import SurveyItem from './SurveysItem'
import SurveysKPI from './SurveysKPI'
import CreateEdit from './CreateEdit/CreateEdit'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Loader from 'ui/Loader'
import PageHeader from 'ui/PageHeader'

const Tab = styled(MuiTab)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.gray400,
  '&.Mui-selected': {
    color: theme.palette.gray800,
  },
}))
const TabLabel = styled(Typography)`
  font-size: 18px;
  font-weight: 400;
`

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
  localSurvey: 'Questionnaire local',
  localSurveys: 'Questionnaires locaux',
  nationalSurvey: 'Questionnaire national',
  nationalSurveys: 'Questionnaires nationaux',
}

const Surveys = () => {
  const [currentScope] = useUserScope()
  const { code: scope } = currentScope
  const [selectedTab, setSelectedTab] = useState(visibility.local)
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [surveyIdToUpdate, setSurveyIdToUpdate] = useState()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()

  const {
    data: paginatedSurveys = null,
    isLoading: isSurveysLoading,
    fetchNextPage: fetchNextPageSurveys,
    hasNextPage: hasNextPageSurveys,
    refetch: refetchSurveys,
  } = useInfiniteQueryWithScope(
    ['paginated-surveys', { feature: 'Surveys', view: 'Surveys' }],
    pageParams => getSurveysQuery(pageParams),
    {
      getNextPageParam,
      onError: handleError,
    }
  )
  const surveys = usePaginatedData(paginatedSurveys)
  const localSurveys = useMemo(() => surveys.filter(({ type }) => type === visibility.local), [surveys])
  const nationalSurveys = useMemo(
    () => surveys.filter(({ type, isPublished }) => type === visibility.national && !!isPublished),
    [surveys]
  )

  const { mutate: createOrUpdateSurvey } = useMutation(createOrUpdateSurveyQuery, {
    onSuccess: ({ published: isPublished }) => {
      enqueueSnackbar(isPublished ? messages.publishSuccess : messages.unpublishSuccess, notifyVariants.success)
      refetchSurveys()
    },
    onError: handleError,
  })

  const { data: surveyDetail = {} } = useQueryWithScope(
    ['survey-detail', { feature: 'Surveys', view: 'Surveys' }, surveyIdToUpdate],
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

  const handleTabChange = (_, tabId) => {
    setSelectedTab(tabId)
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
        {!isSurveysLoading && (
          <>
            <SurveysKPI
              local={{
                count: localSurveys.length,
                title: localSurveys.length > 1 ? messages.localSurveys : messages.localSurvey,
                publishedCount: localSurveys.filter(({ isPublished }) => !!isPublished).length,
              }}
              national={{
                count: nationalSurveys.length,
                title: nationalSurveys.length > 1 ? messages.nationalSurveys : messages.nationalSurvey,
              }}
            />

            <Tabs
              variant="scrollable"
              value={selectedTab}
              onChange={handleTabChange}
              TabIndicatorProps={{ sx: { bgcolor: 'indigo700' } }}
              sx={{ my: 2 }}
            >
              <Tab
                value={visibility.local}
                label={<TabLabel>{messages.localSurveys}</TabLabel>}
                disableRipple
                disableFocusRipple
              />
              <Tab
                value={visibility.national}
                label={<TabLabel>{messages.nationalSurveys}</TabLabel>}
                disableRipple
                disableFocusRipple
              />
            </Tabs>

            {selectedTab === visibility.local && surveys.length > 0 && (
              <InfiniteScroll
                dataLength={localSurveys.length}
                next={() => fetchNextPageSurveys()}
                hasMore={hasNextPageSurveys}
                loader={<Loader />}
              >
                <Grid container spacing={2} data-cy="surveys-local">
                  {localSurveys.map(survey => (
                    <SurveyItem
                      key={survey.id}
                      isPublished={survey.isPublished}
                      readOnly={survey.type !== scopesVisibility[scope]}
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
            {selectedTab === visibility.national && surveys.length > 0 && (
              <InfiniteScroll
                dataLength={nationalSurveys.length}
                next={() => fetchNextPageSurveys()}
                hasMore={hasNextPageSurveys}
                loader={<Loader />}
              >
                <Grid container spacing={2} data-cy="surveys-national">
                  {nationalSurveys.map(survey => (
                    <SurveyItem
                      key={survey.id}
                      isPublished={survey.isPublished}
                      readOnly={survey.type !== scopesVisibility[scope]}
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
          </>
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
