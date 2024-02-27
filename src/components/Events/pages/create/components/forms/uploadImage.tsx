import { DragEvent, MouseEvent, useState } from 'react'
import { Box, Stack } from '@mui/system'
import { Typography } from '@mui/material'
import UploadFilePlaceholder from '~/assets/illustrations/upload-file-placeholder'
import { getFileBase64 } from '~/components/Events/shared/helpers'

type UploadImageProps = {
  onFileChange: (file: string) => void
}

const UploadImage = ({ onFileChange }: UploadImageProps) => {
  const [isOver, setIsOver] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsOver(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsOver(false)
  }

  const handleOpenFile = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = event => {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]

      if (!file) {
        return
      }

      getFileBase64(file).then(base64 => {
        onFileChange(base64)
        setFiles([file])
      })
    }
    input.click()
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsOver(false)

    const droppedFiles = Array.from(event.dataTransfer.files)
    setFiles(droppedFiles)

    getFileBase64(droppedFiles[0]).then(base64 => onFileChange(base64))
  }

  const dynamicText = () => {
    if (files.length > 0 && !isOver) {
      return files.map(file => file.name).join(', ')
    }

    return !isOver ? 'Déposez votre fichier ici' : 'Relâchez votre fichier'
  }

  const handleRemoveFile = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setFiles([])
    onFileChange('')
  }

  if (files.length > 0) {
    return (
      <Stack
        direction="column"
        spacing={2}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        position="relative"
        sx={{
          alignItems: 'center',
          p: 1,
          borderRadius: 1,
          borderStyle: 'dashed',
          borderWidth: 1,
          borderColor: 'grey.300',
          cursor: 'pointer',
          transition: 'all 0.2s',
          backgroundColor: isOver ? 'grey.100' : 'transparent',

          '&:hover': {
            borderColor: 'primary.main',
          },
        }}
        onClick={handleOpenFile}
      >
        <Box
          onClick={event => handleRemoveFile(event)}
          position="absolute"
          top={16}
          right={16}
          p={1}
          borderRadius={1}
          sx={{
            cursor: 'pointer',
            backgroundColor: 'grey.100',
            '&:hover': {
              backgroundColor: 'grey.200',
            },
          }}
        >
          Supprimer
        </Box>

        <img src={URL.createObjectURL(files[0])} alt="preview" width={'100%'} style={{ borderRadius: 6 }} />
      </Stack>
    )
  }

  return (
    <Stack
      direction="column"
      spacing={2}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        alignItems: 'center',
        p: 4,
        borderRadius: 1,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: 'grey.300',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: isOver ? 'grey.100' : 'transparent',

        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
      onClick={handleOpenFile}
    >
      <Box width={200} height={150} display="flex" justifyContent="center" alignItems="center">
        <UploadFilePlaceholder />
      </Box>

      <Typography variant="h6">{dynamicText()}</Typography>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 350 }}>
        Déposez un fichier ici ou cliquez sur
        <Box component="span" color="primary.main">
          {' Parcourir'}
        </Box>{' '}
        votre ordinateur. pour illustrer votre événement.
      </Typography>
    </Stack>
  )
}

export default UploadImage
