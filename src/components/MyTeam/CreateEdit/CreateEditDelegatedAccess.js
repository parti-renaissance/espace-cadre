import PropTypes from 'prop-types'

import { Grid, Typography } from '@mui/material'
import styled from '@emotion/styled'

import { MyTeamMember as DomainMyTeamMember } from 'domain/my-team'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import Feature from './shared/components/Feature'

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
const Description = styled(Typography)`
  font-size: 14px;
  font-weight: 400;
  line-height: 14px;
  opacity: 0.8;
`

const messages = {
  title: 'Accès délégués',
  titleSuffix: '(optionnel)',
  description:
    'En déléguant vos accès, ce membre de votre équipe agira en votre nom depuis cet espace d’administration.',
}

const CreateEditDelegatedAccess = ({ features = [], updateFeatures }) => (
  <>
    <Grid container direction="column" sx={{ pt: 4 }}>
      <Grid item>
        <Title sx={{ color: 'gray800' }}>{messages.title}</Title>&nbsp;
        <Title sx={{ pt: 1, color: 'gray800' }} suffix>
          {messages.titleSuffix}
        </Title>
      </Grid>
      <Description sx={{ pt: 1, color: 'form.label.color' }}>{messages.description}</Description>
    </Grid>

    {features.length > 0 && (
      <Grid container sx={{ pt: 3 }}>
        {features.length <= 8 &&
          features.map(feature => (
            <Feature key={feature} label={feature} value={features.includes(feature)} handleChange={updateFeatures} />
          ))}
        {features.length > 8 && (
          <Grid container>
            <Grid item xs={6}>
              {features.slice(0, 8).map(feature => (
                <Feature
                  key={feature}
                  label={feature}
                  value={features.includes(feature)}
                  handleChange={updateFeatures}
                />
              ))}
            </Grid>
            <Grid item xs={6}>
              {features.slice(8, features.length - 1).map(feature => (
                <Feature
                  key={feature}
                  label={feature}
                  value={features.includes(feature)}
                  handleChange={updateFeatures}
                />
              ))}
            </Grid>
          </Grid>
        )}
      </Grid>
    )}
  </>
)

CreateEditDelegatedAccess.propTypes = {
  features: DomainMyTeamMember.propTypes.features,
  updateFeatures: PropTypes.func.isRequired,
}

export default CreateEditDelegatedAccess
