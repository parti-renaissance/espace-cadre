import { ppd as ppdQuery } from 'api/legal'
import { useQuery } from 'react-query'
import LegalContainer from './LegalContainer'

const PPD = () => {
  const { data: ppd } = useQuery('rgpd', ppdQuery)

  return <LegalContainer data={ppd} />
}

export default PPD
