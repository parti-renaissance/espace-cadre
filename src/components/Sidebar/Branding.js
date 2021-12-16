import { styled } from '@mui/system'
import { Typography } from '@mui/material'
import { ListIcon } from 'ui/icons/ListIcon'

const BrandingWrapper = styled('div')(
  ({ theme }) => `
    display: flex;
    color: ${theme.palette.menu.color.main};
    margin: ${theme.spacing(3, 'auto', 3, 'auto')};
  `
)

const SiteName = styled(Typography)(
  ({ theme }) => `
    font-size: 22px;
    font-weight: 600;
    margin-right: ${theme.spacing(0.5)}
  `
)

const BetaWrapper = styled('span')(
  ({ theme }) => `
    background: ${theme.palette.menu.background.beta};
    padding: ${theme.spacing(0, 0.37, 0.4)};
    border-radius: 4px;
    line-height: 12px;
    height: 12px;
  `
)

const Beta = styled(Typography)`
  font-size: 8px;
  font-weight: 500;
`

const IconWrapper = styled('span')(
  ({ theme }) => `
    margin-right: ${theme.spacing(1.5)};
    margin-top: 5px;
  `
)

const messages = {
  siteName: "Je m'engage",
  beta: 'BÊTA',
}

const Branding = () => (
  <BrandingWrapper>
    <IconWrapper>
      <ListIcon alt="Menu button" />
    </IconWrapper>
    <SiteName>{messages.siteName}</SiteName>
    <BetaWrapper>
      <Beta>{messages.beta}</Beta>
    </BetaWrapper>{' '}
  </BrandingWrapper>
)

export default Branding
