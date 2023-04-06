import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { featuresLabels } from 'shared/features'
import { useCurrentDeviceType } from 'components/shared/device/hooks'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import { MyTeamMember as DomainMyTeamMember } from 'domain/my-team'
import Feature from './shared/components/Feature'
import { useUserScope } from '../../../redux/user/hooks'

const Title = styled(
  Typography,
  shouldForwardProps
)(
  ({ suffix }) => `
  font-size: 20px;
  font-weight: 400;
  line-height: 20px;
  ${
    suffix
      ? `
    font-style: italic;
    opacity: 0.5;
  `
      : ''
  }
`
)
const Description = styled(
  Typography,
  shouldForwardProps
)(
  ({ isMobile }) => `
  font-size: 14px;
  font-weight: 400;
  line-height: ${isMobile ? '21px' : '14px'};
  opacity: 0.8;
`
)

const messages = {
  title: 'Accès délégués',
  titleSuffix: '(optionnel)',
  description:
    'En déléguant vos accès, ce membre de votre équipe agira en votre nom depuis cet espace d’administration.',
}

const skippedFeatures = ['mobile_app', 'my_team']

const CreateEditDelegatedAccess = ({ delegatedFeatures = [], updateDelegatedFeatures }) => {
  const [currentScope] = useUserScope()
  const { isMobile } = useCurrentDeviceType()

  const features = useMemo(
    () => currentScope.features.filter(feature => !skippedFeatures.includes(feature)),
    [currentScope]
  )

  return (
    <>
      <Grid container direction="column" sx={{ pt: 4 }} data-cy="my-team-create-edit-delegated-accesses-header">
        <Grid item>
          <Title sx={{ color: 'gray800' }}>{messages.title}</Title>
          &nbsp;
          <Title sx={{ pt: 1, color: 'gray800' }} suffix>
            {messages.titleSuffix}
          </Title>
        </Grid>
        <Description sx={{ pt: 1, color: 'form.label.color' }} isMobile={isMobile}>
          {messages.description}
        </Description>
      </Grid>

      {features.length > 0 && (
        <Grid container sx={{ pt: 3 }} data-cy="my-team-create-edit-delegated-accesses-features">
          {isMobile &&
            features.map(key => (
              <Feature
                key={key}
                name={key}
                label={featuresLabels[key]}
                value={delegatedFeatures.includes(key)}
                handleChange={updateDelegatedFeatures}
              />
            ))}
          {!isMobile &&
            features.length <= 6 &&
            features.map(key => (
              <Feature
                key={key}
                name={key}
                label={featuresLabels[key]}
                value={delegatedFeatures.includes(key)}
                handleChange={updateDelegatedFeatures}
              />
            ))}
          {!isMobile && features.length > 6 && (
            <Grid container>
              <Grid item xs={6}>
                {features.slice(0, 6).map(key => (
                  <Feature
                    key={key}
                    name={key}
                    label={featuresLabels[key]}
                    value={delegatedFeatures.includes(key)}
                    handleChange={updateDelegatedFeatures}
                  />
                ))}
              </Grid>
              <Grid item xs={6}>
                {features.slice(6, features.length).map(key => (
                  <Feature
                    key={key}
                    name={key}
                    label={featuresLabels[key]}
                    value={delegatedFeatures.includes(key)}
                    handleChange={updateDelegatedFeatures}
                  />
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      )}
    </>
  )
}

CreateEditDelegatedAccess.propTypes = {
  delegatedFeatures: DomainMyTeamMember.propTypes.features,
  updateDelegatedFeatures: PropTypes.func.isRequired,
}

export default CreateEditDelegatedAccess
