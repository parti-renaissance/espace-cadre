import ReactMarkdown from 'react-markdown'
import { cgu as cguQuery } from 'api/legal'
import { useQuery } from 'react-query'

const CGU = () => {
  const { data: cgu } = useQuery('rgpd', cguQuery)
  return (
    <>
      <h1>{cgu?.title}</h1>
      <ReactMarkdown>{cgu?.content}</ReactMarkdown>
    </>
  )
}

export default CGU
