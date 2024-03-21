import { Box, Button, Card, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { ShareOutlined } from '@mui/icons-material'
import { Stack } from '@mui/system'

interface ShareLinkProps {
  link: string
}

const openNewTab = (url: string) => {
  const win = window.open(url, '_blank')
  win?.focus()
}

const ShareLink = ({ link }: ShareLinkProps) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Partager le lien',
          url: link!,
        })
      } catch (error) {
        openNewTab(link!)
      }
    }
    openNewTab(link!)
  }

  return (
    <Card sx={{ p: '24px' }}>
      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mb: '16px' }}>
        <Button variant="outlined" size="large" fullWidth={true} onClick={() => navigator.clipboard.writeText(link)}>
          Copier le lien
        </Button>

        <Button startIcon={<ShareOutlined />} variant="contained" fullWidth={true} size="large" onClick={handleShare}>
          Partager
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          border: 1,
          borderRadius: '8px',
          borderColor: 'grey.300',
          p: '14px',
        }}
      >
        <Link
          color="primary"
          variant="body2"
          underline="hover"
          component={RouterLink}
          to={link}
          sx={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
          referrerPolicy="no-referrer"
          target="_blank"
          rel="noopener noreferrer"
        >
          {link}
        </Link>
      </Box>
    </Card>
  )
}

export default ShareLink
