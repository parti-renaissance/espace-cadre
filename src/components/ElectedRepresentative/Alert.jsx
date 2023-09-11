import { Link } from 'react-router-dom'
import paths from 'shared/paths'
import { Typography, Alert as AlertMui } from '@mui/material'

const Alert = () => (
  <AlertMui severity="warning" sx={{ py: 0.5, mb: 3, fontSize: '12px' }}>
    Attention ! <br />
    Cet onglet n&apos;est plus utilisé pour définir votre base d&apos;élus. Nous avons migré ces fonctionnalités
    directement dans l&apos;onglet{' '}
    <Link to={paths.contacts}>
      <Typography sx={{ fontSize: '12px', fontWeight: 500, color: 'colors.blue.500' }}>Militants</Typography>
    </Link>{' '}
    &gt; dans l&apos;onglet élu du volet de détail des militants.
  </AlertMui>
)

export default Alert
