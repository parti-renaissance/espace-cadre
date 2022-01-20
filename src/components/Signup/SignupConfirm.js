import { styled } from '@mui/system'
import { Box as MuiBox, Container, Typography as MuiTypography } from '@mui/material'

const Box = styled(MuiBox)(
  ({ theme }) => `
    margin: ${theme.spacing(4, 'auto', 0)}
`
)

const Typography = styled(MuiTypography)`
  font-size: 28px;
  font-weight: 500;
  line-height: 38px;
`

const SignupConfirm = () => (
  <Container maxWidth="md">
    <Box>
      <Typography>Merci de vous être inscrit</Typography>
    </Box>
  </Container>
)

export default SignupConfirm
