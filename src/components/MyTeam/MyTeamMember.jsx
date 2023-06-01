import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

import { MyTeamMember as DomainMyTeamMember } from 'domain/my-team'
import pluralize from 'components/shared/pluralize/pluralize'
import { TruncatedText, VerticalContainer } from 'components/shared/styled'
import UICard, { CtaButton } from 'ui/Card'
import DotsMenu, { DotsMenuItem } from 'ui/Card/Menu/DotsMenu'

const HorizontalContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const messages = {
  edit: 'modifier',
  delete: 'supprimer',
  delegatedAccess: 'accès délégué',
  noDelegatedAccess: 'Aucun accès délégué',
}

const MyTeamMember = ({ role, activist, accessCount, handleUpdate, handleDelete }) => (
  <Grid item xs={12} sm={6} md={3}>
    <UICard
      rootProps={{ sx: { height: '155px' } }}
      headerProps={{ sx: { pt: '21px' } }}
      header={
        <>
          <VerticalContainer>
            <TruncatedText
              variant="subtitle1"
              data-cy="my-team-member-item-name"
              title={activist ? `${activist.firstName} ${activist.lastName}` : ''}
              sx={{ color: 'gray900' }}
            >
              {activist && `${activist.firstName} ${activist.lastName}`}
            </TruncatedText>
            <TruncatedText variant="subtitle2" sx={{ pt: 0.5, color: 'main' }}>
              {activist.emailAddress}
            </TruncatedText>
            <TruncatedText variant="subtitle2" data-cy="my-team-member-item-role" sx={{ pt: 0.5, color: 'gray600' }}>
              {role}
            </TruncatedText>
            <Typography
              variant="subtitle2"
              data-cy="my-team-member-item-access-count"
              sx={{ pt: 1, color: 'gray600', fontWeight: 500 }}
            >
              {accessCount > 0 && `${accessCount} ${pluralize(accessCount, messages.delegatedAccess)}`}
              {accessCount === 0 && messages.noDelegatedAccess}
            </Typography>
          </VerticalContainer>
        </>
      }
      actionsProps={{ sx: { pt: 3 } }}
      actions={
        <HorizontalContainer>
          <CtaButton
            data-cy="my-team-member-action-view"
            onClick={handleUpdate}
            sx={{
              color: 'main',
              '&:hover': {
                bgcolor: 'campaign.background.hover',
              },
            }}
          >
            <Typography variant="button" sx={{ textTransform: 'uppercase' }}>
              {messages.edit}
            </Typography>
          </CtaButton>
          <DotsMenu>
            <DotsMenuItem onClick={handleDelete}>{messages.delete}</DotsMenuItem>
          </DotsMenu>
        </HorizontalContainer>
      }
    />
  </Grid>
)

MyTeamMember.propTypes = {
  ...DomainMyTeamMember.propTypes,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
}

export default MyTeamMember
