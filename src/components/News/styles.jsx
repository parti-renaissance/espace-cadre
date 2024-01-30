// NEWS styles
import { Grid, Button, Typography } from '@mui/material'
import { styled } from '@mui/system'
import LoadingButton from '@mui/lab/LoadingButton'
import { shouldForwardProps } from '~/components/shared/shouldForwardProps'

export const Title = styled(Typography)(
  ({ theme }) => `
    font-size: 24px;
    line-height: 24px;
    font-weight: 400;
    color: ${theme.palette.gray800};
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

export const CTAButton = styled(Button)(
  ({ theme }) => `
    color: ${theme.palette.news.button.main.color};
    background: ${theme.palette.button.background.main};
    border: none;
    border-radius: 8px;
    &:hover {
      color: ${theme.palette.news.button.main.color};
      background-color: ${theme.palette.button.background.main};
    }
    line-height: 24px;
    font-size: 14px;
    width: 154px;
  `
)

export const CTAButtonOutlined = styled(LoadingButton)(
  ({ theme, ispublished }) => `
    color: ${ispublished ? theme.palette.news.button.outlined.secondary : theme.palette.news.button.outlined.primary};
    border: 1px ${
      ispublished ? theme.palette.news.button.outlined.secondary : theme.palette.news.button.outlined.primary
    } solid;
    &:hover {
      color: ${theme.palette.news.button.main.color};
      background-color: ${
        ispublished ? theme.palette.news.button.outlined.secondary : theme.palette.news.button.outlined.primary
      };
      border: 1px ${
        ispublished ? theme.palette.news.button.outlined.secondary : theme.palette.news.button.outlined.primary
      } solid;
    }
    line-height: 24px;
    font-size: 14px;
    width: 140px;
  `
)

export const Container = styled(Grid)(
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

export const Option = styled(Typography)(
  ({ theme }) => `
      font-size: 16px;
      line-height: 16px;
      font-weight: 400;
      color: ${theme.palette.gray300};
      margin-left: 4px;
      font-style: italic;
    `
)

export const Body = styled(Typography)(
  ({ theme }) => `
      font-size: 14px;
      line-height: 21px;
      font-weight: 400;
      color: ${theme.palette.gray80};
    `
)

export const CTAButtonContainer = styled(
  Grid,
  shouldForwardProps
)(
  () => `
      display: 'flex';
      justify-content: 'flex-end';
    `
)
