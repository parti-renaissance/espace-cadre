import { CtaButton } from 'ui/Card'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import DotsMenu, { DotsMenuItem } from 'ui/Card/Menu/DotsMenu'

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`

const messages = {
  see: 'Voir',
  published: 'Publier',
  unPublished: 'Dépublier',
}

const Actions = ({ status, toggleStatus, loader = false, onView }) => (
  <HorizontalContainer>
    <CtaButton
      onClick={onView}
      sx={{
        color: 'orange500',
        '&:hover': {
          bgcolor: 'newsBackground',
        },
      }}
    >
      {messages.see}
    </CtaButton>
    <DotsMenu>
      <DotsMenuItem onClick={toggleStatus} loader={loader}>
        {status ? messages.unPublished : messages.published}
      </DotsMenuItem>
    </DotsMenu>
  </HorizontalContainer>
)

export default Actions

Actions.propTypes = {
  status: PropTypes.bool.isRequired,
  toggleStatus: PropTypes.func.isRequired,
  loader: PropTypes.bool,
  onView: PropTypes.func.isRequired,
}
