import { Tab as MuiTab, Typography } from '@mui/material'
import { styled } from '@mui/system'

export const Tab = styled(MuiTab)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.colors.gray[600],
  '&.Mui-selected': {
    color: theme.palette.colors.blue[500],
  },
}))

export const TabLabel = styled(Typography)`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`
