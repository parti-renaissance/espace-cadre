import { Grid } from '@mui/material'
import { styled } from '@mui/system'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'
import PropTypes from 'prop-types'
import Riposte from '~/domain/riposte'
import pluralize from '~/components/shared/pluralize/pluralize'

const Chip = styled('div')(
  ({ theme }) => `
  font-size: 10px;
  font-weight: 500;
  border-radius: 19px;
  padding: ${theme.spacing(0.25, 1)};
  border: 1px solid ${theme.palette.gray200};
`
)

const messages = {
  view: 'vue',
  detailed: 'détaillée',
  action: 'action',
  numeric: 'numérique',
}

const Content = ({ riposte }) => {
  const { withNotification, views, detailViews, ripostes } = riposte
  const NotificationIcon = withNotification ? NotificationsActiveRoundedIcon : NotificationsOffRoundedIcon

  return (
    <Grid container spacing={1}>
      <Grid item>
        <NotificationIcon
          sx={{
            fontSize: '17px',
            fontWeight: '500',
            borderRadius: '19px',
            py: 0.25,
            px: 1,
            border: 1,
            borderColor: 'gray200',
          }}
        />
      </Grid>
      <Grid item>
        <Chip>
          {views} {pluralize(views, messages.view)}
        </Chip>
      </Grid>
      <Grid item>
        <Chip>
          {detailViews} {pluralize(detailViews, messages.view)} {pluralize(detailViews, messages.detailed)}
        </Chip>
      </Grid>
      <Grid item>
        <Chip>
          {ripostes} {pluralize(ripostes, messages.action)} {pluralize(ripostes, messages.numeric)}
        </Chip>
      </Grid>
    </Grid>
  )
}

Content.propTypes = {
  riposte: Riposte.propTypes.isRequired,
  handleEdit: PropTypes.func.isRequired,
  toggleStatus: PropTypes.func.isRequired,
}

export default Content
