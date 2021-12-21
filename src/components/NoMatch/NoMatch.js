import { useLocation, Link } from 'react-router-dom'
import { styled } from '@mui/system'
import { Paper as MuiPaper, Typography } from '@mui/material'
import paths from 'shared/paths'

const Paper = styled(MuiPaper)(
  ({ theme }) => ` 
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: auto;
  padding: ${theme.spacing(2)};
  border-radius: 8px;
  width: 50%;
  `
)

const Button = styled(Link)(
  ({ theme }) => `
  background: ${theme.palette.blueCorner};
  border-radius: 8px;
  padding: ${theme.spacing(1, 2)};
  margin: ${theme.spacing(0, 'auto')};
`
)

function NoMatch() {
  const location = useLocation()

  return (
    <Paper>
      <Typography sx={{ mb: 2 }}>
        L&apos;URL recherchée <strong>{location.pathname}</strong> n&apos;existe pas ou vous n&apos;avez pas les droits
        pour y accéder
      </Typography>
      <Button to={paths.dashboard}>
        <Typography variant="body2" sx={{ color: 'whiteCorner' }}>
          Retournez à l&apos;accueil
        </Typography>
      </Button>
    </Paper>
  )
}

export default NoMatch
