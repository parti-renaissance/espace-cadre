import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { Typography } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import { CGU, PPD } from './constants'
import { CGUQuery, PPDQuery } from 'api/legal'
import { useQuery } from 'react-query'

const Container = styled('div')(
  ({ theme }) => `
    max-width: 700px;
    padding: ${theme.spacing(2)};
    margin: ${theme.spacing(0, 'auto')};
  `
)

const LegalContainer = ({ type }) => {
  const { data: cgu } = useQuery('rgpd', CGUQuery, { enabled: type === CGU })
  const { data: ppd } = useQuery('rgpd', PPDQuery, { enabled: type === PPD })

  return (
    <Container>
      <Typography sx={{ fontSize: '34px', lineHeight: '38px' }}>{cgu?.title || ppd?.title}</Typography>
      <ReactMarkdown>{cgu?.content || ppd?.content}</ReactMarkdown>
    </Container>
  )
}

LegalContainer.propTypes = {
  type: PropTypes.string.isRequired,
}

export default LegalContainer
