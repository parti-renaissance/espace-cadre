import CtaButton from 'ui/Card/CtaButton/CtaButton'
import { styled } from '@mui/system'
import { generatePath, useNavigate } from 'react-router-dom'
import paths from '../shared/paths'
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
  edit: 'Modifier',
}

const Actions = ({ teamId, onEdit }) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(generatePath(`:teamId/${paths.update}`, { teamId }))
  }

  return (
    <Horizontal>
      <CtaButton
        onClick={handleClick}
        sx={{
          color: 'lightBlue600',
          '&:hover': {
            backgroundColor: 'teamBackground',
          },
        }}
      >
        {messages.see}
      </CtaButton>
      <DotsMenu>
        <DotsMenu.Item onClick={onEdit}>{messages.edit}</DotsMenu.Item>
      </DotsMenu>
    </Horizontal>
  )
}

export default Actions

Actions.propTypes = {
  teamId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
}
