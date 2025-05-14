import { grey } from '~/theme/palette'
import { pxToRem } from '~/theme/typography'
import { Avatar as MUIAvatar, Box, Modal } from '@mui/material'
import { useState } from 'react'

interface Props {
  initials?: string
  imageUrl?: string | null
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: 1,
}

export default function Avatar({ initials, imageUrl }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <MUIAvatar
        sx={{
          bgcolor: grey[200],
          color: grey[600],
          fontSize: pxToRem(12),
          fontWeight: 'bold',
          cursor: imageUrl ? 'pointer' : 'default',
        }}
        src={imageUrl || undefined}
        onClick={() => imageUrl && setOpen(true)}
      >
        {initials}
      </MUIAvatar>

      {!!imageUrl && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box sx={style}>
            <img src={imageUrl} alt="Agrandissement" style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 8 }} />
          </Box>
        </Modal>
      )}
    </>
  )
}
