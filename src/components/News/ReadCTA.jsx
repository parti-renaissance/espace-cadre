import { useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Grid } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import PropTypes from 'prop-types'
import { getNewsQuery, updateNewsStatusQuery } from '~/api/news'
import { refetchUpdatedPage } from '~/api/pagination'
import { notifyVariants } from '~/components/shared/notification/constants'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { useInfiniteQueryWithScope } from '~/api/useQueryWithScope'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import { Body, Container, CTAButton, CTAButtonContainer, CTAButtonOutlined, SectionTitle } from './styles'
import { CTA_MODE_PUBLICATION } from './constants'

const messages = {
  toggleSuccess: 'La notification a bien été modifiée',
  title: 'Bouton d’action',
  unpublish: 'Dépublier',
  publish: 'Publier',
  ctaText: 'Lorsqu’il existe, un bouton s’affiche en bas de la notification. Ajoutez-en un en la modifiant.',
  publishText: 'Lorsqu’elle est publiée, une notification est visible de vos militants sur l’application mobile.',
  publicationTitle: 'Publication',
}

const CallToActionContainer = ({ mode, news, handleClose }) => {
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()

  const { data: paginatedNews = null, refetch } = useInfiniteQueryWithScope(
    ['paginated-news', { feature: 'News', view: 'News' }],
    getNewsQuery,
    {
      onError: handleError,
    }
  )

  const { mutateAsync: updateNewsStatus, isLoading: isToggleStatusLoading } = useMutation(updateNewsStatusQuery, {
    onSuccess: async (_, updatedNews) => {
      await refetchUpdatedPage(paginatedNews, refetch, updatedNews.id)
      enqueueSnackbar(messages.toggleSuccess, notifyVariants.success)
      handleClose()
    },
    onError: handleError,
  })

  const toggleNewsStatus = useCallback(async () => {
    const toggledNews = news.toggleStatus()
    await updateNewsStatus(toggledNews)
  }, [news, updateNewsStatus])

  const isPublication = mode === CTA_MODE_PUBLICATION
  const isPublished = !!news.status
  const hasCTA = !!(news.url && news.urlLabel)
  const CTALabel = news.urlLabel ? news.urlLabel : ''
  const shouldDisplayCTA = !isPublication && hasCTA
  const { isMobile } = useCurrentDeviceType()
  const defaultBreakpoint = shouldDisplayCTA || isPublication ? 8 : 12

  return (
    <Container container sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
      <Grid item xs={isMobile ? 12 : defaultBreakpoint}>
        <SectionTitle>{isPublication ? messages.publicationTitle : messages.title}</SectionTitle>
        <Body component="p" sx={{ mt: 1 }}>
          {isPublication ? messages.publishText : messages.ctaText}
        </Body>
      </Grid>
      <CTAButtonContainer item xs={shouldDisplayCTA ? 4 : 0}>
        {isPublication && (
          <CTAButtonOutlined
            sx={{ mt: isMobile ? 2 : 0 }}
            loading={isToggleStatusLoading}
            variant="outlined"
            ispublished={+isPublished}
            onClick={() => toggleNewsStatus()}
            startIcon={isPublished ? <VisibilityOffIcon /> : <VisibilityIcon />}
          >
            {isPublished ? messages.unpublish : messages.publish}
          </CTAButtonOutlined>
        )}
        {shouldDisplayCTA && (
          <CTAButton sx={{ mt: isMobile ? 2 : 0 }} onClick={() => window.open(news.url, '_blank')}>
            {CTALabel}
          </CTAButton>
        )}
      </CTAButtonContainer>
    </Container>
  )
}

CallToActionContainer.propTypes = {
  mode: PropTypes.string,
  news: PropTypes.object,
  handleClose: PropTypes.func,
}

export default CallToActionContainer
