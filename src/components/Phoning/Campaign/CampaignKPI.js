import PropTypes from 'prop-types'
import { Grid, Paper, Typography } from '@mui/material'
import { styled } from '@mui/system'

import UICard from '../Card'
import PhoningRatioProgress from '../shared/PhoningRatioProgress'

const KPIWrapper = styled(Paper)(
  ({ theme }) => `
  width: 100%;
  padding: ${theme.spacing(2)};
  background: ${theme.palette.gray200};
  border-radius: 12px;
`
)
const Title = styled(Typography)(
  ({ theme }) => `
	margin: ${theme.spacing(1, 0, 2, 1)};
	font-size: 18px;
	font-weight: 400px;
  line-height: 27px;
`
)
const SubTitle = styled(props => <Typography component="div" variant="subtitle1" {...props} />)(
  ({ theme }) => `
  color: ${theme.palette.gray900};
`
)
const SubTitleDetail = styled(props => <Typography component="div" variant="subtitle2" {...props} />)(
  ({ theme }) => `
  color: ${theme.palette.gray600};
`
)
const Score = styled(Typography)(
  ({ theme }) => `
  color: ${theme.palette.phoning.background.ratio.current};
  font-size: 28px;
  font-weight: 600;
  line-height: 42px;
`
)

const messages = {
  title: 'Indicateurs',
  dayRemaining: 'Jours restants',
  surveys: 'Questionnaires',
  calls: 'Appels passés',
  callsToRemindPrefix: 'Dont',
  callsToRemindSuffix: 'à rappeler',
  contacts: 'Contacts',
  averageTime: 'Temps moyen',
  averageTimeDetail: 'Passé par appel',
}

const PhoningCampaignKPI = ({ dayRemaining, surveys, calls, averageTime }) => (
  <KPIWrapper>
    <Grid container>
      <Title>{messages.title}</Title>
    </Grid>

    <Grid container spacing={2}>
      <Grid item lg={2.4} xl={2.4} sx={{ flexGrow: 1 }}>
        <UICard
          content={
            <>
              <Score>{dayRemaining}</Score>
              <SubTitle>{messages.dayRemaining}</SubTitle>
            </>
          }
          contentProps={{ sx: { pt: 3, '&:last-child': { pb: 2 } } }}
        />
      </Grid>
      <Grid item lg={2.4} xl={2.4} sx={{ flexGrow: 1 }}>
        <UICard
          headerTitle={<SubTitle>{messages.surveys}</SubTitle>}
          headerProps={{ sx: { pt: 3, pb: 1 } }}
          content={<PhoningRatioProgress count={surveys.count} totalCount={surveys.goal} />}
          contentProps={{ sx: { '&:last-child': { pb: 2 } } }}
        />
      </Grid>
      <Grid item lg={2.4} xl={2.4} sx={{ flexGrow: 1 }}>
        <UICard
          content={
            <>
              <Score>{calls.count}</Score>
              <SubTitle>{messages.calls}</SubTitle>
              <SubTitleDetail>
                {messages.callsToRemindPrefix}&nbsp;
                {calls.toRemind}&nbsp;
                {messages.callsToRemindSuffix}
              </SubTitleDetail>
            </>
          }
          contentProps={{ sx: { pt: 3, '&:last-child': { pb: 2 } } }}
        />
      </Grid>
      <Grid item lg={2.4} xl={2.4} sx={{ flexGrow: 1 }}>
        <UICard
          content={
            <>
              <Score>A venir</Score>
              <SubTitle>{messages.contacts}</SubTitle>
            </>
          }
          contentProps={{ sx: { pt: 3, '&:last-child': { pb: 2 } } }}
        />
      </Grid>
      <Grid item lg={2.4} xl={2.4} sx={{ flexGrow: 1 }}>
        <UICard
          content={
            <>
              <Score>{averageTime}</Score>
              <SubTitle>{messages.averageTime}</SubTitle>
              <SubTitleDetail>{messages.averageTimeDetail}</SubTitleDetail>
            </>
          }
          contentProps={{ sx: { pt: 3, '&:last-child': { pb: 2 } } }}
        />
      </Grid>
    </Grid>
  </KPIWrapper>
)

PhoningCampaignKPI.propTypes = {
  dayRemaining: PropTypes.string.isRequired,
  surveys: PropTypes.shape({
    count: PropTypes.string.isRequired,
    goal: PropTypes.string.isRequired,
  }),
  calls: PropTypes.shape({
    count: PropTypes.string.isRequired,
    toRemind: PropTypes.string.isRequired,
  }),
  averageTime: PropTypes.string.isRequired,
}

export default PhoningCampaignKPI
