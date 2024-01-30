import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { generatePath, useNavigate } from 'react-router'
import noImage from '~/assets/no-image.png'
import { paths as messageriePaths } from '~/components/Messagerie/shared/paths'
import Button from '~/ui/Button/Button'
import UICard from '~/ui/Card'

const Card = ({ template }) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(generatePath(`${messageriePaths.create}?templateId=${template.uuid}`))
  }

  return (
    <UICard
      rootProps={{ sx: { p: 0, border: '1px solid', borderColor: 'colors.gray.200', overflow: 'hidden' } }}
      header={
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              height: '8rem',
              bgcolor: 'colors.gray.50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src={noImage} height="75" width="75" alt="no image" />
          </Box>
          {template.from_admin && (
            <Box
              sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                bgcolor: 'inactiveLabel',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockOutlinedIcon sx={{ color: 'form.error.color', fontSize: '16px' }} />
            </Box>
          )}
        </Box>
      }
      content={
        <Box sx={{ p: 1.5 }}>
          <Typography component="h2" sx={{ fontWeight: '500', color: 'colors.gray.900', fontSize: '16px' }}>
            {template.label}
          </Typography>
        </Box>
      }
      actions={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5 }} className="space-x-2">
          <Button onClick={handleClick} rootProps={{ sx: { fontSize: '12px' } }} isMainButton>
            Utiliser
          </Button>
        </Box>
      }
    />
  )
}

export default Card

Card.propTypes = {
  template: PropTypes.object,
  onDropTemplate: PropTypes.func,
}
