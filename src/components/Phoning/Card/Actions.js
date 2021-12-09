import { CtaButton } from 'ui/Card'
import { styled } from '@mui/system'
import { generatePath, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

const HorizontalContainer = styled('div')`
  display: flex;
  flex: 1;
  align-items: flex-end;
  justify-content: space-between;
`

const messages = {
  see: 'Voir',
}

const Actions = ({ campaignId }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(generatePath('/phoning/:id', { id: campaignId }))
  }

  return (
    <HorizontalContainer>
      <CtaButton
        onClick={handleClick}
        sx={{
          color: 'indigo700',
          '&:hover': {
            bgcolor: '#F0EFFB',
          },
        }}
      >
        {messages.see}
      </CtaButton>
    </HorizontalContainer>
  )
}

export default Actions

Actions.propTypes = {
  campaignId: PropTypes.string.isRequired,
}
