import { CtaButton } from 'ui/Card'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import DotsMenu from 'ui/Card/Menu/DotsMenu'

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: flex-end;
  justify-content: space-between;
`

const messages = {
  see: 'Voir',
  published: 'Publier',
  unPublished: 'Dépublier',
}

const Actions = ({ status, toggleStatus, onView }) => (
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
      <DotsMenu.Item onClick={toggleStatus}>{status ? messages.unPublished : messages.published}</DotsMenu.Item>
    </DotsMenu>
  </HorizontalContainer>
)

export default Actions

Actions.propTypes = {
  status: PropTypes.bool.isRequired,
  toggleStatus: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
}
