import ReactMarkdown from 'react-markdown'
import { cgu as cguQuery } from 'api/legal'
import { useQuery } from 'react-query'
import { styled } from '@mui/system'

const Container = styled('div')(
  ({ theme }) => `
  max-width: 700px;
  padding: ${theme.spacing(2)};
  margin: ${theme.spacing(0, 'auto')};
`
)

const CGU = () => {
  const { data: cgu } = useQuery('rgpd', cguQuery)

  return (
    <Container>
      <h1>{cgu?.title}</h1>
      <ReactMarkdown>{cgu?.content}</ReactMarkdown>
    </Container>
  )
}

export default CGU
