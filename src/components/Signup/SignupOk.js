import { styled } from '@mui/system'
import { Box as MuiBox, Typography as MuiTypography } from '@mui/material'

const Box = styled(MuiBox)(
  ({ theme }) => `
    margin: ${theme.spacing(0, 'auto')}
`
)

const Typography = styled(MuiTypography)`
  font-size: 28px;
  font-weight: 500;
  line-height: 38px;
`

const SignupOk = () => (
  <Box>
    <Typography>Merci de vous être inscrit</Typography>
  </Box>
)

export default SignupOk
