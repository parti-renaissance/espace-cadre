import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { Typography as MuiTypography } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import { PPD, CGUWeb, CGUMobile, CookiesWeb, CookiesMobile } from '../constants'
import { PPDQuery, CGUQueryWeb, CGUQueryMobile, CookiesQueryWeb, CookiesQueryMobile } from 'api/legal'
import { useQuery } from 'react-query'

const Container = styled('div')(
  ({ theme }) => `
    max-width: 700px;
    padding: ${theme.spacing(2)};
    margin: ${theme.spacing(0, 'auto')};
  `
)

const Typography = styled(MuiTypography)`
  font-size: 34px;
  font-weight: 700;
  line-height: 38px;
`

const LegalContainer = ({ type }) => {
  const { data: ppd } = useQuery('rgpd', PPDQuery, { enabled: type === PPD })
  const { data: cguWebData } = useQuery('rgpd', CGUQueryWeb, { enabled: type === CGUWeb })
  const { data: cguMobileData } = useQuery('rgpd', CGUQueryMobile, { enabled: type === CGUMobile })
  const { data: cookiesWebData } = useQuery('rgpd', CookiesQueryWeb, { enabled: type === CookiesWeb })
  const { data: cookiesMobileData } = useQuery('rgpd', CookiesQueryMobile, { enabled: type === CookiesMobile })

  return (
    <Container>
      <ReactMarkdown>
        {ppd?.content ||
          cguWebData?.content ||
          cguMobileData?.content ||
          cookiesWebData?.content ||
          cookiesMobileData?.content}
      </ReactMarkdown>
    </Container>
  )
}

LegalContainer.propTypes = {
  type: PropTypes.string.isRequired,
}

export default LegalContainer
