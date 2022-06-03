import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

export const Title = styled(Typography)(
  () => `
    color: #1F2937;
    font-size: 24px;
    font-weight: 400;
    line-height: 24px;
    margin-bottom: 57px; 
  `
)

export const FormTitle = styled(Typography)(
  () => `
    color: #09101D;
    font-size: 14px;
    font-weight: 600;
    line-height: 14px;
  `
)

export const CTAContainer = styled(Grid)(
  ({ theme }) => `
        padding: ${theme.spacing(2)};
        margin-bottom: ${theme.spacing(2)};
        background-color: ${theme.palette.gray40};
        width: 100%;
        border-radius: 8px;
      `
)

export const SectionTitle = styled(Typography)(
  ({ theme }) => `
        font-size: 20px;
        line-height: 20px;
        font-weight: 400;
        color: ${theme.palette.gray800};
      `
)

export const SectionBody = styled(Typography)(
  ({ theme }) => `
        font-size: 14px;
        line-height: 21px;
        font-weight: 400;
        color: ${theme.palette.gray80};
      `
)

export const SubTitle = styled(Typography)(
  ({ theme }) => `
      font-size: 14px;
      line-height: 14px;
      font-weight: 600;
      color: ${theme.palette.neutralBlack};
    `
)
