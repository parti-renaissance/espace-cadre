import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { Typography as MuiTypography } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import { CGU, PPD } from '../constants'
import { CGUQuery, PPDQuery } from 'api/legal'
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
  const { data: cgu } = useQuery('rgpd', CGUQuery, { enabled: type === CGU })
  const { data: ppd } = useQuery('rgpd', PPDQuery, { enabled: type === PPD })

  return (
    <Container>
      <Typography>{cgu?.title || ppd?.title}</Typography>
      <ReactMarkdown>{cgu?.content || ppd?.content}</ReactMarkdown>
    </Container>
  )
}

LegalContainer.propTypes = {
  type: PropTypes.string.isRequired,
}

export default LegalContainer
