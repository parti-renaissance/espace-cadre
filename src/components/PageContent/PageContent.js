import PropTypes from 'prop-types'
import { Container } from '@mui/material'
import { styled } from '@mui/system'

const PageContentWrapper = styled('div')`
  margin: ${({ theme }) => theme.spacing(2, 0, 0, 34)};
  ${props => props.theme.breakpoints.down('lg')} {
    flex: 1;
    margin-left: 0;
  } ;
`

const PageContent = ({ children }) => (
  <PageContentWrapper>
    <Container maxWidth="xl">{children}</Container>
  </PageContentWrapper>
)

export default PageContent

PageContent.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
}
