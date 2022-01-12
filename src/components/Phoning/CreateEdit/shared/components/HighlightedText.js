import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'

const HightlightedText = ({ text, inputText }) => {
  const matches = match(text, inputText)
  const parts = parse(text, matches)
  return (
    <div>
      {parts.map((part, index) => (
        <Typography
          key={index}
          variant="subtitle1"
          sx={{
            fontWeight: part.highlight ? 500 : 400,
            color: part.highlight ? 'campaign.color' : 'inherit',
          }}
        >
          {part.text}
        </Typography>
      ))}
    </div>
  )
}

HightlightedText.propTypes = {
  text: PropTypes.string.isRequired,
  inputText: PropTypes.string.isRequired,
}

export default HightlightedText
