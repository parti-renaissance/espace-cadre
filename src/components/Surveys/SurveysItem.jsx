import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

import { SurveyItem as DomainSurveyItem } from '~/domain/surveys'
import pluralize from '~/components/shared/pluralize/pluralize'
import { TruncatedText, VerticalContainer } from '~/components/shared/styled'
import { chipColorsByStatus, chipLabelByStatus, published, unpublished } from './shared/constants'
import UICard, { UIChip, CtaButton } from '~/ui/Card'
import DotsMenu, { DotsMenuItem } from '~/ui/Card/Menu/DotsMenu'

const HorizontalContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const messages = {
  by: 'Par',
  questions: 'question',
  answers: 'réponse',
  see: 'voir les réponses',
  publish: 'Publier',
  unpublish: 'Dépublier',
  update: 'Modifier',
}

const SurveyItem = ({
  isPublished,
  title,
  author,
  questionsCount,
  answersCount,
  readOnly,
  handleView,
  handlePublish,
  handleUpdate,
}) => {
  const chipLabel = chipLabelByStatus[isPublished ? published : unpublished]
  const chipColors = chipColorsByStatus[isPublished ? published : unpublished]

  return (
    <Grid item xs={12} sm={6} md={3}>
      <UICard
        rootProps={{ sx: { minHeight: '207px', height: '100%' } }}
        headerProps={{ sx: { pt: '21px' } }}
        header={
          <>
            <HorizontalContainer>
              <UIChip
                data-cy="surveys-item-status"
                label={chipLabel}
                {...chipColors}
                sx={{ minHeight: '16px', mr: 1 }}
              />
            </HorizontalContainer>
            <VerticalContainer>
              <TruncatedText
                variant="subtitle1"
                data-cy="surveys-item-title"
                title={title}
                lines={2}
                sx={{ minHeight: '48px', pt: 1 }}
              >
                {title}
              </TruncatedText>
              <TruncatedText
                variant="subtitle2"
                data-cy="surveys-item-author"
                title={author && `${messages.by} ${author.firstName} ${author.lastName}`}
                sx={{ minHeight: '18px', pt: 0.5, color: 'gray600' }}
              >
                {author && `${messages.by} ${author.firstName} ${author.lastName}`}
              </TruncatedText>
            </VerticalContainer>
          </>
        }
        contentProps={{ sx: { pt: 1 } }}
        content={
          <Grid container>
            {Number.isInteger(questionsCount) && (
              <UIChip
                data-cy="surveys-item-questions-count"
                variant="outlined"
                color="gray700"
                label={`${questionsCount} ${pluralize(questionsCount, messages.questions)}`}
                sx={{ mr: 1 }}
              />
            )}
            {Number.isInteger(answersCount) && (
              <UIChip
                data-cy="surveys-item-answers-count"
                variant="outlined"
                color="gray700"
                label={`${answersCount} ${pluralize(answersCount, messages.answers)}`}
                sx={{ mr: 1 }}
              />
            )}
          </Grid>
        }
        actionsProps={{ sx: { pt: 3 } }}
        actions={
          <HorizontalContainer>
            <CtaButton
              data-cy="surveys-action-view"
              onClick={handleView}
              sx={{
                color: 'main',
                '&:hover': {
                  bgcolor: 'campaign.background.hover',
                },
              }}
            >
              <Typography variant="button" sx={{ textTransform: 'uppercase' }}>
                {messages.see}
              </Typography>
            </CtaButton>
            {!readOnly && (
              <DotsMenu>
                <DotsMenuItem onClick={handlePublish}>
                  {isPublished ? messages.unpublish : messages.publish}
                </DotsMenuItem>
                <DotsMenuItem onClick={handleUpdate}>{messages.update}</DotsMenuItem>
              </DotsMenu>
            )}
          </HorizontalContainer>
        }
      />
    </Grid>
  )
}

SurveyItem.propTypes = {
  ...DomainSurveyItem.propTypes,
  readOnly: PropTypes.bool.isRequired,
  handleView: PropTypes.func.isRequired,
  handlePublish: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
}

export default SurveyItem
