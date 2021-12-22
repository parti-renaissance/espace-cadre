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

const Button = styled(CtaButton)`
  color: ${({ theme }) => theme.palette.button.color};
  &:hover {
    background: ${({ theme }) => theme.palette.button.background.main};
  }
  border-radius: 8px;
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
      <Button onClick={handleClick}>{messages.update}</Button>
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
