import { useState } from 'react'
import { styled } from '@mui/system'
import { Menu, MenuItem as MuiMenuItem } from '@mui/material'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'

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
  color: ${theme.palette.menu.color.main};
  font-size: 10px;
  display: flex;
  margin: ${theme.spacing(0.5, 2)};
  padding: ${theme.spacing(0.5, 1)};
  border-radius: 6px;
  &:hover {
    color: ${theme.palette.menu.color.main};
    background: ${theme.palette.menu.background.hover};
  }
`
)

const messages = {
  personalData: 'Mes données personnelles',
  legalNotices: 'Mentions légales',
  cookiesPolicy: 'Politique de cookies',
  dataProtection: 'Politique de protection des données',
  warning: "Cellule d'alerte",
  signature: 'Designé et assemblé par le Pôle Tech & Innovation',
}

const MentionsLegales = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <LegalNoticesWrapper>
      <LegalNoticesIcon onClick={handleClick} />
      <Menu
        anchorEl={anchorEl}
        open={open}
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
          <a href="https://donnees.en-marche.fr/">{messages.personalData}</a>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <a href="https://en-marche.fr/mentions-legales">{messages.legalNotices}</a>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <a href="https://en-marche.fr/politique-cookies">{messages.cookiesPolicy}</a>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <a href="https://en-marche.fr/politique-protection-donnees">{messages.dataProtection}</a>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <a href="https://www.bkms-system.com/bkwebanon/report/clientInfo?cin=Jp3wHD&c=-1&language=fre">
            {messages.warning}
          </a>
        </MenuItem>
      </Menu>
    </LegalNoticesWrapper>
  )
}

export default MentionsLegales
