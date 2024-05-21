/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { generatePath, useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { Container, Grid, Tab as MuiTab, Tabs, Typography } from '@mui/material'
import InfiniteScroll from 'react-infinite-scroll-component'
import { styled } from '@mui/system'

import { useInfiniteQueryWithScope, useQueryWithScope } from '~/api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from '~/api/pagination'
import { getSurveysQuery, getOneSurveyQuery, createOrUpdateSurveyQuery, getSurveysKpis } from '~/api/surveys'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { notifyVariants } from '~/components/shared/notification/constants'
import { useUserScope } from '~/redux/user/hooks'
import { getScopeVisibility, visibility } from './shared/constants'
import SurveyItem from './SurveysItem'
import SurveysKPI from './SurveysKPI'
import CreateEdit from './CreateEdit/CreateEdit'
import { PageHeaderButton } from '~/ui/PageHeader/PageHeader'
import Loader from '~/ui/Loader'
import PageHeader from '~/ui/PageHeader'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import scopes from '~/shared/scopes'

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
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [surveyIdToUpdate, setSurveyIdToUpdate] = useState()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()
  const { isMobile } = useCurrentDeviceType()
  const isNational = currentScope.isNational()
  const [selectedTab, setSelectedTab] = useState(isNational ? visibility.national : visibility.local)
  const [isCreateResolved, setIsCreateResolved] = useState(false)

  const {
    data: paginatedNationalSurveys = null,
    isLoading: isNationalSurveysLoading,
    fetchNextPage: fetchNextPageNationalSurveys,
    hasNextPage: hasNextPageNationalSurveys,
    refetch: refetchNationalSurveys,
  } = useInfiniteQueryWithScope(
    ['paginated-national-surveys', { feature: 'Surveys', view: 'Surveys' }],
    pageParams => getSurveysQuery(pageParams, visibility.national),
    {
      getNextPageParam,
      onError: handleError,
    }
  )
  const {
    data: paginatedLocalSurveys = null,
    isLoading: isLocalSurveysLoading,
    fetchNextPage: fetchNextPageLocalSurveys,
    hasNextPage: hasNextPageLocalSurveys,
    refetch: refetchLocalSurveys,
  } = useInfiniteQueryWithScope(
    ['paginated-local-surveys', { feature: 'Surveys', view: 'Surveys' }],
    pageParams => getSurveysQuery(pageParams, visibility.local),
    {
      getNextPageParam,
      onError: handleError,
    }
  )

  const localSurveys = usePaginatedData(paginatedLocalSurveys)
  const nationalSurveys = usePaginatedData(paginatedNationalSurveys)

  const { mutate: createOrUpdateSurvey } = useMutation(createOrUpdateSurveyQuery, {
    onSuccess: async ({ published: isPublished }) => {
      enqueueSnackbar(isPublished ? messages.publishSuccess : messages.unpublishSuccess, notifyVariants.success)
      await refetchLocalSurveys()
      await refetchNationalSurveys()
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

  const { data: surveysKPIs = {} } = useQueryWithScope(
    ['surveys-kpis', { feature: 'Surveys', view: 'Surveys' }],
    getSurveysKpis,
    {
      onError: handleError,
    }
  )
  const { localSurveysCount, localSurveysPublishedCount, nationalSurveysCount, nationalSurveysPublishedCount } =
    surveysKPIs

  const togglePublish = surveyId => () => {
    const { id, isPublished } = isNational
      ? nationalSurveys.find(({ id }) => id === surveyId)
      : localSurveys.find(({ id }) => id === surveyId)
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

  useEffect(() => {
    if (!isCreateResolved) {
      localSurveys.length < 20 && fetchNextPageLocalSurveys()
      nationalSurveys.length < 20 && fetchNextPageNationalSurveys()
    }
  }, [localSurveys, nationalSurveys])

  useEffect(() => {
    if (isCreateEditModalOpen) {
      setIsCreateResolved(false)
    }
  }, [isCreateEditModalOpen])

  return (
    <Container maxWidth={false} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.pageTitle}
          button={
            <PageHeaderButton
              label={
                <Typography variant="button">
                  {messages.create}
                  &nbsp;
                  {getScopeVisibility(scope)}
                </Typography>
              }
              onClick={() => setIsCreateEditModalOpen(true)}
              isMainButton
            />
          }
        />
      </Grid>

      <Grid
        container
        justifyContent="space-between"
        data-cy="surveys-container"
        sx={{ pt: isMobile ? 2 : null, ...infiniteScrollStylesOverrides }}
      >
        {isNationalSurveysLoading && isLocalSurveysLoading ? (
          <Loader isCenter />
        ) : (
          <>
            <SurveysKPI
              local={{
                count: localSurveysCount || 0,
                title: localSurveysCount > 1 ? messages.localSurveys : messages.localSurvey,
                publishedCount: localSurveysPublishedCount,
              }}
              national={{
                count: nationalSurveysCount || 0,
                title: nationalSurveysCount > 1 ? messages.nationalSurveys : messages.nationalSurvey,
                publishedCount: nationalSurveysPublishedCount,
              }}
              currentScope={scope}
            />

            <Tabs
              variant="scrollable"
              value={selectedTab}
              onChange={handleTabChange}
              TabIndicatorProps={{ sx: { bgcolor: 'indigo700' } }}
              sx={{ my: 2 }}
            >
              {!isNational && (
                <Tab
                  value={visibility.local}
                  label={<TabLabel>{messages.localSurveys}</TabLabel>}
                  disableRipple
                  disableFocusRipple
                />
              )}
              {scope !== scopes.legislative_candidate && (
                <Tab
                  value={visibility.national}
                  label={<TabLabel>{messages.nationalSurveys}</TabLabel>}
                  disableRipple
                  disableFocusRipple
                />
              )}
            </Tabs>

            {selectedTab === visibility.local && localSurveys.length > 0 && (
              <InfiniteScroll
                dataLength={localSurveys.length}
                next={() => fetchNextPageLocalSurveys()}
                hasMore={hasNextPageLocalSurveys}
                loader={<Loader />}
              >
                <Grid container spacing={2} data-cy="surveys-local">
                  {localSurveys.map(survey => (
                    <SurveyItem
                      key={survey.id}
                      isPublished={survey.isPublished}
                      readOnly={survey.type !== getScopeVisibility(scope)}
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
            {selectedTab === visibility.national && nationalSurveys.length > 0 && (
              <InfiniteScroll
                dataLength={nationalSurveys.length}
                next={() => fetchNextPageNationalSurveys()}
                hasMore={hasNextPageNationalSurveys}
                loader={<Loader />}
              >
                <Grid container spacing={2} data-cy="surveys-national">
                  {nationalSurveys.map(survey => (
                    <SurveyItem
                      key={survey.id}
                      isPublished={survey.isPublished}
                      readOnly={survey.type !== getScopeVisibility(scope)}
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
          onCreateResolve={() => {
            setIsCreateResolved(true)
            refetchNationalSurveys()
            refetchLocalSurveys()
          }}
          handleClose={handleClose}
        />
      )}
    </Container>
  )
}

export default Surveys
