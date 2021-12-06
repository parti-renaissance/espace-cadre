import CtaButton from 'ui/Card/CtaButton/CtaButton'
import { styled } from '@mui/system'
import { generatePath, useNavigate } from 'react-router-dom'
import paths from 'components/Messagerie/shared/paths'
import PropTypes from 'prop-types'
import DotsMenu from 'ui/Card/Menu/DotsMenu'

const Horizontal = styled('div')`
  display: flex;
  flex: 1;
  align-items: end;
  justify-content: space-between;
`

const messages = {
  update: 'Modifier',
  delete: 'Supprimer',
}

const Actions = ({ messageId }) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(generatePath(':messageId/' + paths.update, { messageId }))
  }

  return (
    <Horizontal>
      <CtaButton
        onClick={handleClick}
        sx={{
          color: 'yellow400',
          '&:hover': {
            backgroundColor: '#FFFAEE',
          },
        }}
      >
        {messages.update}
      </CtaButton>
      <DotsMenu>
        <DotsMenu.Item onClick={() => {}}>{messages.delete}</DotsMenu.Item>
      </DotsMenu>
    </Horizontal>
  )
}

export default Actions

Actions.propTypes = {
  messageId: PropTypes.string.isRequired,
}
