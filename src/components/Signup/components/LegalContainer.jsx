import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import ReactMarkdown from 'react-markdown'
import { Ppd, CGUWeb, CGUMobile, CookiesWeb, CookiesMobile } from '../constants'
import { PPDQuery, CGUQueryWeb, CGUQueryMobile, CookiesQueryWeb, CookiesQueryMobile } from 'api/legal'
import { useQuery } from '@tanstack/react-query'

const Container = styled('div')(
  ({ theme }) => `
    max-width: 700px;
    padding: ${theme.spacing(2)};
    margin: ${theme.spacing(0, 'auto')};
  `
)

const LegalContainer = ({ type }) => {
  const { data: ppd } = useQuery({
    queryKey: ['PPD', { feature: 'Signup', view: 'LegalContainer' }],
    queryFn: PPDQuery,
    enabled: type === Ppd,
  })
  const { data: cguWeb } = useQuery({
    queryKey: ['CGU-web', { feature: 'Signup', view: 'LegalContainer' }],
    queryFn: CGUQueryWeb,
    enabled: type === CGUWeb,
  })
  const { data: cguMobile } = useQuery({
    queryKey: ['CGU-mobile', { feature: 'Signup', view: 'LegalContainer' }],
    queryFn: CGUQueryMobile,
    enabled: type === CGUMobile,
  })
  const { data: cookiesWeb } = useQuery({
    queryKey: ['cookies-web', { feature: 'Signup', view: 'LegalContainer' }],
    queryFn: CookiesQueryWeb,
    enabled: type === CookiesWeb,
  })
  const { data: cookiesMobile } = useQuery({
    queryKey: ['cookies-mobile', { feature: 'Signup', view: 'LegalContainer' }],
    queryFn: CookiesQueryMobile,
    enabled: type === CookiesMobile,
  })

  return (
    <Container>
      <ReactMarkdown>
        {ppd?.content || cguWeb?.content || cguMobile?.content || cookiesWeb?.content || cookiesMobile?.content}
      </ReactMarkdown>
    </Container>
  )
}

LegalContainer.propTypes = {
  type: PropTypes.string.isRequired,
}

export default LegalContainer
