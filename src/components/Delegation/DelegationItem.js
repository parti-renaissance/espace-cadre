// import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

import pluralize from 'components/shared/pluralize/pluralize'
import { TruncatedText, VerticalContainer } from 'components/shared/styled'
import RatioProgress from 'ui/RatioProgress/RatioProgress'
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
}

const DelegationItem = ({ firstName, lastName, role, accessCount, handleUpdate, handleDelete }) => {
  console.log({ firstName, lastName, accessCount, handleUpdate, handleDelete })
  return (
    <Grid item xs={12} sm={6} md={3}>
      <UICard
        rootProps={{ sx: { height: '155px' } }}
        headerProps={{ sx: { pt: '21px' } }}
        header={
          <>
            <VerticalContainer>
              <TruncatedText
                variant="subtitle1"
                title={`${firstName} ${lastName}`}
                data-cy="delegations-item-name"
                sx={{ color: 'gray900' }}
              >
                {firstName} {lastName}
              </TruncatedText>
              <Typography variant="subtitle2" data-cy="delegations-item-role" sx={{ pt: 0.5, color: 'gray600' }}>
                {role}
              </Typography>
              <Typography
                variant="subtitle2"
                data-cy="delegations-item-access-count"
                sx={{ pt: 1, color: 'gray600', fontWeight: 500 }}
              >
                {accessCount}&nbsp;
                {pluralize(accessCount, messages.delegatedAccess)}
              </Typography>
            </VerticalContainer>
          </>
        }
        actionsProps={{ sx: { pt: 3 } }}
        actions={
          <HorizontalContainer>
            <CtaButton
              data-cy="phoning-action-view"
              onClick={handleUpdate}
              sx={{
                color: 'campaign.color',
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
}

// DelegationItem.propTypes = {
//   ...DomainDelegationItem.propTypes,
//   handleUpdate: PropTypes.func.isRequired,
//   handleDelete: PropTypes.func.isRequired,
// }

export default DelegationItem
