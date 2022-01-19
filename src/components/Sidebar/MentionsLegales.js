import { useState } from 'react'
import { styled } from '@mui/system'
import { Menu, MenuItem as MuiMenuItem, Typography as MuiTypography } from '@mui/material'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import { Link } from 'react-router-dom'
import { CGUPath, PPDPath } from '../Signup/constants'

const LegalNoticesWrapper = styled('span')(
  ({ theme }) => `
  padding: ${theme.spacing(0.2, 1, 0)};
  margin-right: 10px;
  background: ${theme.palette.menu.background.hover};
  border-radius: 30px;
`
)

const LegalNoticesIcon = styled(ErrorOutlineRoundedIcon)`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.menu.color.main};
  cursor: pointer;
`

const MenuItem = styled(MuiMenuItem)(
  ({ theme }) => `
  margin: ${theme.spacing(0.5, 2)};
  padding: ${theme.spacing(0, 1, 0.25)};
  border-radius: 6px;
  &:hover {
    background: ${theme.palette.menu.background.hover};
  }
`
)

const Typography = styled(MuiTypography)(
  ({ theme }) => `
  color: ${theme.palette.menu.color.main};
  padding: 0;
  margin: 0;
  font-size: 10px;
  &:hover: {
    color: ${theme.palette.menu.color.main};
  }
`
)

const messages = {
  personalData: 'Mes données personnelles',
  legalNotices: 'Mentions légales',
  cookiesPolicy: 'Politique de cookies',
  dataProtection: 'Politique de protection des données',
  alertCenter: "Cellule d'alerte",
  signature: 'Designé et assemblé par le Pôle Tech & Innovation',
}

const alertCenterPath = 'https://www.bkms-system.com/bkwebanon/report/clientInfo?cin=Jp3wHD&c=-1&language=fre'

const MentionsLegales = () => {
  const [menuAnchor, setMenuAnchor] = useState(null)

  const handleClick = event => {
    setMenuAnchor(event.currentTarget)
  }

  const handleClose = () => {
    setMenuAnchor(null)
  }

  return (
    <LegalNoticesWrapper>
      <LegalNoticesIcon onClick={handleClick} />
      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiMenu-paper': {
            bgcolor: 'menu.background.main',
          },
        }}
      >
        <MenuItem onClick={handleClose}>
          <Link to={CGUPath}>
            <Typography>{messages.legalNotices}</Typography>
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link to={PPDPath}>
            <Typography>{messages.dataProtection}</Typography>
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <a href={alertCenterPath}>
            <Typography>{messages.alertCenter}</Typography>
          </a>
        </MenuItem>
      </Menu>
    </LegalNoticesWrapper>
  )
}

export default MentionsLegales
