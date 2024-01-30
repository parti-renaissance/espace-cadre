import PropTypes from 'prop-types'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

import { useErrorHandler } from '~/components/shared/error/hooks'
import { getSurveysRepliesExport } from '~/api/surveys'
import { useQueryWithScope } from '~/api/useQueryWithScope'

import { CtaButton } from '~/ui/Card'
import DownloadIcon from '~/ui/icons/DownloadIcon'

const Export = styled(props => <Typography variant="button" {...props} />)(({ theme }) => ({
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: '22px',
  textTransform: 'uppercase',
  color: theme.palette.main,
  '&:hover': {
    backgroundColor: theme.palette.campaign.background.hover,
  },
}))

const messages = {
  export: 'Exporter',
}

const SurveyDetailRepliesExport = ({ surveyTitle }) => {
  const { surveyId } = useParams()
  const { handleError } = useErrorHandler()
  const [isExportFetchable, setIsExportFetchable] = useState(false)

  useQueryWithScope(
    ['replies-export', { feature: 'Surveys', view: 'SurveyDetailRepliesExport' }, surveyId],
    () => getSurveysRepliesExport(surveyId, surveyTitle),
    {
      enabled: !!isExportFetchable,
      onSuccess: () => {
        setIsExportFetchable(false)
      },
      onError: handleError,
    }
  )

  const handleExport = () => {
    setIsExportFetchable(true)
  }

  return (
    <Grid item alignItems="center" sx={{ pl: '21px' }}>
      <CtaButton
        onClick={handleExport}
        sx={{
          color: 'main',
          '&:hover': {
            bgcolor: 'campaign.background.hover',
          },
        }}
      >
        <DownloadIcon sx={{ pr: 1, color: 'main', fontSize: '18px' }} />
        <Export>{messages.export}</Export>
      </CtaButton>
    </Grid>
  )
}

SurveyDetailRepliesExport.propTypes = {
  surveyTitle: PropTypes.string.isRequired,
}

export default SurveyDetailRepliesExport
