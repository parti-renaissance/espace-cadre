import { useState } from 'react'
import { styled } from '@mui/system'
import { Popover } from '@mui/material'
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

const Ul = styled('ul')`
  padding-left: 0;
`

const Li = styled('li')`
  color: ${({ theme }) => theme.palette.menu.color.main};
  font-size: 10px;
  display: flex;
  margin: ${({ theme }) => theme.spacing(0.5, 2)};
  padding: ${({ theme }) => theme.spacing(0.5, 1)};
  border-radius: 8.35px;
  &:hover {
    color: ${({ theme }) => theme.palette.menu.color.main};
    background: ${({ theme }) => theme.palette.menu.background.hover};
  }
`

const Signature = styled('div')`
  color: ${({ theme }) => theme.palette.menu.color.main};
  font-size: 10px;
  margin: ${({ theme }) => theme.spacing(1, 2)};
  padding: ${({ theme }) => theme.spacing(0.5, 1)};
`

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
  const id = open ? 'simple-popover' : undefined

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <LegalNoticesWrapper>
      <LegalNoticesIcon onClick={handleClick} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPaper-root': {
            bgcolor: 'menu.background.main',
          },
        }}
      >
        <Ul>
          <Li>
            <a href="https://donnees.en-marche.fr/">{messages.personalData}</a>
          </Li>
          <Li>
            <a href="https://en-marche.fr/mentions-legales">{messages.legalNotices}</a>
          </Li>
          <Li>
            <a href="https://en-marche.fr/politique-cookies">{messages.cookiesPolicy}</a>
          </Li>
          <Li>
            <a href="https://en-marche.fr/politique-protection-donnees">{messages.dataProtection}</a>
          </Li>
          <Li>
            <a href="https://www.bkms-system.com/bkwebanon/report/clientInfo?cin=Jp3wHD&c=-1&language=fre">
              {messages.warning}
            </a>
          </Li>
        </Ul>
        <Signature>{messages.signature}</Signature>
      </Popover>
    </LegalNoticesWrapper>
  )
}

export default MentionsLegales
