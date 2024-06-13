import { Box, Button, Card, CardContent, IconButton, Typography } from '@mui/material'
import Iconify from '~/mui/iconify'
import { Stack } from '@mui/system'
import { ActionAPIModel } from '~/models/actions.model'

interface Props {
  item: ActionAPIModel
}

export default function ActionCard({ item }: Props) {
  return (
    <Card data-cy="ui-card">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
          <Typography variant="caption" noWrap color="text.secondary">
            <Typography variant="caption" noWrap color="text.secondary">
              azeerty
            </Typography>
          </Typography>
        </Box>

        <Stack>
          <Typography variant="subtitle2" noWrap color={'text.primary'}>
            {item.author.first_names}
          </Typography>
        </Stack>

        <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={2} data-cy="dot-action-menu">
          {false ? (
            <IconButton>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
          ) : (
            <Button color="primary">{"Voir l'événement"}</Button>
          )}

          <Stack display="flex" direction="row" spacing={1} alignItems="center">
            {1 && (
              <Stack direction="row" spacing={0.5} alignItems="center" marginTop={1}>
                <Iconify icon={'solar:users-group-rounded-bold'} color="text.disabled" />
                <Typography variant="caption" noWrap color="text.disabled">
                  1
                </Typography>
              </Stack>
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}
