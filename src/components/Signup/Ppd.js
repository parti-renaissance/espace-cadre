import ReactMarkdown from 'react-markdown'
import { ppd as ppdQuery } from 'api/legal'
import { useQuery } from 'react-query'

const PPD = () => {
  const { data: ppd } = useQuery('rgpd', ppdQuery)
  return <ReactMarkdown>{ppd?.content}</ReactMarkdown>
}

export default PPD
