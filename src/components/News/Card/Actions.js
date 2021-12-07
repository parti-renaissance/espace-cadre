import CtaButton from 'ui/Card/CtaButton/CtaButton'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import DotsMenu from 'ui/Card/Menu/DotsMenu'

const Horizontal = styled('div')`
  display: flex;
  flex: 1;
  align-items: end;
  justify-content: space-between;
`

const messages = {
  see: 'Voir',
  published: 'Publier',
  unPublished: 'Dépublier',
}

const Actions = ({ status, toggleStatus, onView }) => (
  <Horizontal>
    <CtaButton
      onClick={onView}
      sx={{
        color: 'orange500',
        '&:hover': {
          backgroundColor: 'newsBackground',
        },
      }}
    >
      {messages.see}
    </CtaButton>
    <DotsMenu>
      <DotsMenu.Item onClick={toggleStatus}>{status ? messages.unPublished : messages.published}</DotsMenu.Item>
    </DotsMenu>
  </Horizontal>
)

export default Actions

Actions.propTypes = {
  status: PropTypes.bool.isRequired,
  toggleStatus: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
}
