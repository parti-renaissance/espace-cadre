import PropTypes from 'prop-types'
import { Box, Dialog, Grid } from '@mui/material'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { getTemplates } from '~/api/messagerie'
import { useErrorHandler } from '~/components/shared/error/hooks'
import Button from '~/ui/Button/Button'
import EmptyContent from '~/ui/EmptyContent/EmptyContent'
import Title from '~/ui/Title'
import Loader from '~/ui/Loader/Loader'
import Card from './Card'

const Templates = ({ handleClose, isMailsStatutory = false }) => {
  const { handleError } = useErrorHandler()

  const { data, isLoading } = useQueryWithScope(
    ['messagerie-templates', { feature: 'Templates', view: 'Templates' }],
    () => getTemplates(isMailsStatutory),
    { onError: handleError }
  )

  return (
    <Dialog data-cy="messagerie-modal-templates" open onClose={handleClose} fullWidth={true} maxWidth="lg">
      <Grid
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderBottomColor: 'colors.gray.200',
        }}
      >
        <Title title="Modèles d'email" />
      </Grid>
      <Box sx={{ height: '100%', maxHeight: '650px', overflow: 'hidden', overflowY: 'scroll', px: 2, py: 4 }}>
        {isLoading && <Loader isCenter />}
        {data?.items.length > 0 ? (
          <Grid container rowSpacing={3} spacing={2} data-cy="messagerie-templates-container">
            {data.items.map(template => (
              <Grid key={template.uuid} item xs={12} md={4} lg={3} data-cy="messagerie-template-card">
                <Card template={template} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyContent description="Aucun modèle de template disponible" />
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Button onClick={handleClose} aria-label="close" isMainButton data-cy="messagerie-close-modal">
          Fermer
        </Button>
      </Box>
    </Dialog>
  )
}

export default Templates

Templates.propTypes = {
  handleClose: PropTypes.func,
  isMailsStatutory: PropTypes.bool,
}
