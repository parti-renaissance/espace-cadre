import { useLocation, Link } from 'react-router-dom'
import { styled } from '@mui/system'
import { Paper as MuiPaper, Typography } from '@mui/material'
import paths from '~/shared/paths'

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

const messages = {
  prefix: "L'URL recherchée",
  suffix: "n'existe pas ou vous n'avez pas les droits pour y accéder",
  back: "Retournez à l'accueil",
}

function NoMatch() {
  const location = useLocation()

  return (
    <Paper>
      <Typography sx={{ mb: 2 }}>
        {messages.prefix} <strong>{location.pathname}</strong> {messages.suffix}
      </Typography>
      <Button to={paths.dashboard}>
        <Typography variant="body2" sx={{ color: 'whiteCorner' }}>
          {messages.back}
        </Typography>
      </Button>
    </Paper>
  )
}

export default NoMatch
