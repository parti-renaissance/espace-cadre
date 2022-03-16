import { useCallback } from 'react'
import { useMutation } from 'react-query'
import { Grid } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import PropTypes from 'prop-types'

import { getNewsQuery, updateNewsStatusQuery } from 'api/news'
import { getNextPageParam, refetchUpdatedPage } from 'api/pagination'
import { notifyVariants } from 'components/shared/notification/constants'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'

import {
  NEWS_READ_UNPUBLISH_BUTTON,
  NEWS_READ_PUBLISH_BUTTON,
  NEWS_CTA_TITLE,
  NEWS_READ_CTA_TEXT,
  NEWS_READ_PUBLISH_TEXT,
  NEWS_READ_PUBLICATION_TITLE,
} from './constants'
import { SectionTitle, Container, Body, CTAButton, CTAButtonOutlined } from './styles'

const messages = {
  toggleSuccess: "L'actualité a bien été modifiée",
}

const CallToActionContainer = ({ mode, news, closeModal }) => {
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()

  const { data: paginatedNews = null, refetch } = useInfiniteQueryWithScope(
    ['paginated-news', { feature: 'News', view: 'News' }],
    getNewsQuery,
    {
      getNextPageParam,
      onError: handleError,
    }
  )

  const { mutateAsync: updateNewsStatus, isLoading: isToggleStatusLoading } = useMutation(updateNewsStatusQuery, {
    onSuccess: async (_, updatedNews) => {
      await refetchUpdatedPage(paginatedNews, refetch, updatedNews.id)
      enqueueSnackbar(messages.toggleSuccess, notifyVariants.success)
      closeModal()
    },
    onError: handleError,
  })

  const toggleNewsStatus = useCallback(async () => {
    const toggledNews = news.toggleStatus()
    await updateNewsStatus(toggledNews)
  }, [news, updateNewsStatus])

  const isPublication = mode === 'publication'
  const isPublished = news.status
  const hasCTA = news.url && news.urlLabel
  const CTALabel = news.urlLabel ? news.urlLabel : ''
  const shouldDisplayCTA = !isPublication && hasCTA

  return (
    <Container container sx={{ mb: 2, justifyContent: 'space-between' }}>
      <Grid item xs={shouldDisplayCTA || isPublication ? 8 : 12}>
        <SectionTitle>{isPublication ? NEWS_READ_PUBLICATION_TITLE : NEWS_CTA_TITLE}</SectionTitle>
        <Body component={'p'} sx={{ mt: 1 }}>
          {isPublication ? NEWS_READ_PUBLISH_TEXT : NEWS_READ_CTA_TEXT}
        </Body>
      </Grid>
      <Grid
        item
        xs={shouldDisplayCTA ? 4 : 0}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
      >
        {isPublication && (
          <CTAButtonOutlined
            loading={isToggleStatusLoading}
            variant="outlined"
            ispublished={isPublished.toString()}
            onClick={() => toggleNewsStatus()}
            startIcon={isPublished ? <VisibilityOffIcon /> : <VisibilityIcon />}
            sx={{
              border: isPublished ? '1px #CC0613 solid' : '1px #2834C3 solid',
            }}
          >
            {isPublished ? NEWS_READ_UNPUBLISH_BUTTON : NEWS_READ_PUBLISH_BUTTON}
          </CTAButtonOutlined>
        )}
        {shouldDisplayCTA && <CTAButton onClick={() => window.open(news.url, '_blank')}>{CTALabel}</CTAButton>}
      </Grid>
    </Container>
  )
}

CallToActionContainer.propTypes = {
  mode: PropTypes.string,
  news: PropTypes.object,
  closeModal: PropTypes.func,
}

export default CallToActionContainer
