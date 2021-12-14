import { CtaButton } from 'ui/Card'
import { styled } from '@mui/system'
import { generatePath, useNavigate } from 'react-router-dom'
import paths from 'components/Messagerie/shared/paths'
import PropTypes from 'prop-types'
import DotsMenu, { DotsMenuItem } from 'ui/Card/Menu/DotsMenu'

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`

const messages = {
  update: 'Modifier',
  delete: 'Supprimer',
}

const Actions = ({ messageId, del, loader = false }) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(generatePath(':messageId/' + paths.update, { messageId }))
  }

  return (
    <HorizontalContainer>
      <CtaButton
        onClick={handleClick}
        sx={{
          color: 'yellow400',
          '&:hover': {
            bgcolor: '#FFFAEE',
          },
        }}
      >
        {messages.update}
      </CtaButton>
      <DotsMenu>
        <DotsMenuItem onClick={del} loader={loader}>
          {messages.delete}
        </DotsMenuItem>
      </DotsMenu>
    </HorizontalContainer>
  )
}

export default Actions

Actions.propTypes = {
  messageId: PropTypes.string.isRequired,
  del: PropTypes.func.isRequired,
  loader: PropTypes.bool,
}
