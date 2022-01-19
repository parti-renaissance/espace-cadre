import { cgu as cguQuery } from 'api/legal'
import { useQuery } from 'react-query'
import LegalContainer from './LegalContainer'

const CGU = () => {
  const { data: cgu } = useQuery('rgpd', cguQuery)

  return <LegalContainer data={cgu} />
}

export default CGU
