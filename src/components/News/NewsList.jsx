import PropTypes from 'prop-types'
import { Grid } from '@mui/material'
import UICard, { Title } from '~/ui/Card'
import Header from './Card/Header'
import Actions from './Card/Actions'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'

const NewsList = ({ data, toggleNewsStatus, handleEdit, handleView, isToggleStatusLoading }) => {
  const { isMobile } = useCurrentDeviceType()
  return (
    <Grid container spacing={2} sx={{ mt: 0, ...(isMobile && { pt: 2 }) }}>
      {data.map(n => (
        <Grid item key={n.id} xs={12} sm={6} md={3}>
          <UICard
            rootProps={{ sx: { borderRadius: '8px' } }}
            headerProps={{ sx: { pt: '21px' } }}
            header={
              <>
                <Header {...n} />
                <Title
                  subject={n.title}
                  author={n.creator ? `${n.creator.first_name} ${n.creator.last_name}` : null}
                  sx={{ pt: 1 }}
                  dateTime={n.createdAt}
                />
              </>
            }
            actions={
              <Actions
                toggleStatus={() => toggleNewsStatus(n.id)}
                handleEdit={handleEdit(n.id)}
                onView={handleView(n.id)}
                status={n.status}
                statusLoader={isToggleStatusLoading}
              />
            }
          />
        </Grid>
      ))}
    </Grid>
  )
}

NewsList.propTypes = {
  data: PropTypes.array.isRequired,
  toggleNewsStatus: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleView: PropTypes.func.isRequired,
  isToggleStatusLoading: PropTypes.bool.isRequired,
}

export default NewsList
