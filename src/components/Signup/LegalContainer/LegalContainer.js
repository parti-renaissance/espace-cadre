import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import ReactMarkdown from 'react-markdown'

const Container = styled('div')(
  ({ theme }) => `
    max-width: 700px;
    padding: ${theme.spacing(2)};
    margin: ${theme.spacing(0, 'auto')};
  `
)

const LegalContainer = ({ data }) => (
  <Container>
    <h1>{data?.title}</h1>
    <ReactMarkdown>{data?.content}</ReactMarkdown>
  </Container>
)

LegalContainer.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }),
}

export default LegalContainer
