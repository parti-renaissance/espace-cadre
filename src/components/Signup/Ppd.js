import ReactMarkdown from 'react-markdown'
import { ppd as ppdQuery } from 'api/legal'
import { useQuery } from 'react-query'

const PPD = () => {
  const { data: ppd } = useQuery('rgpd', ppdQuery)
  return (
    <>
      <h1>{ppd?.title}</h1>
      <ReactMarkdown>{ppd?.content}</ReactMarkdown>
    </>
  )
}

export default PPD
