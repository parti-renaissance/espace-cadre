import { Card, CardContent, CardMedia, Box, Grid, Typography, IconButton } from '@mui/material'
import Label from '~/mui/label'
import { Stack } from '@mui/system'
import { formatDate } from '~/shared/helpers'
import Iconify from '~/mui/iconify'
import { AdsClick, DoNotDisturbOn, Drafts, Place } from '@mui/icons-material'
import { grey } from '~/theme/palette'
import { Message } from '~/domain/message'
import PlaceholderEmailThumbnail from '~/assets/illustrations/placeholder-email-thumbnail'

type MessageCardProps = {
  message: Message
  isMailsStatutory: boolean
  onPopoverOpen: (message: Message) => (el: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const statsConfig = [
  ['sent', 'solar:user-rounded-bold', 'Contacts'],
  ['clickRate', AdsClick, 'de clics'],
  ['openingRate', Drafts, "d'ouverture"],
  ['unsubscribes', DoNotDisturbOn, 'désabonnement'],
] as const

const MessageCard = ({ message, onPopoverOpen, ...props }: MessageCardProps) => (
  <Card>
    <Box padding={1}>
      {message.draft ? (
        <Label sx={{ position: 'absolute', marginTop: 1, marginRight: 2, right: 0 }} variant="filled" color="warning">
          Brouillon
        </Label>
      ) : null}
      <PlaceholderEmailThumbnail sx={{ borderRadius: 1, height: 235, backgroundColor: 'gray300' }} />
    </Box>
    <CardContent>
      <Stack>
        {props.isMailsStatutory ? (
          <Typography variant="subtitle2" noWrap>
            {message.subject}
          </Typography>
        ) : (
          <>
            <Typography variant="subtitle2" noWrap>
              {message.label}
            </Typography>
            <Typography variant="caption" noWrap color="text.secondary">
              {message.subject}
            </Typography>
          </>
        )}
      </Stack>
      <Stack direction="row" spacing={1} marginY={2}>
        <Label variant="soft" color="info">
          Newletter
        </Label>
      </Stack>
      {!message.draft ? (
        <Grid container marginBottom={2}>
          {statsConfig.map(([statName, Icon, text]) => (
            <Grid item xs={6} key={statName}>
              <Stack direction="row" alignItems="center" spacing={1} marginY={1}>
                {typeof Icon === 'string' ? (
                  <Iconify color={grey[400]} icon={Icon} />
                ) : (
                  <Icon sx={{ color: grey[400] }} />
                )}
                <Typography variant="caption" noWrap>
                  <Typography variant="caption" component="span" fontWeight={500}>
                    {(message.statistics?.[statName] ?? '0') + (statName.endsWith('Rate') ? '%' : '')}
                  </Typography>
                  &nbsp;{text}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      ) : null}
      <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
        {!props.isMailsStatutory || (props.isMailsStatutory && message.draft) ? (
          <IconButton aria-label="actions" aria-describedby={message.id} onClick={onPopoverOpen(message)}>
            <Iconify icon="eva:more-horizontal-fill" />
          </IconButton>
        ) : (
          <div></div>
        )}

        <Typography variant="subtitle1">
          {formatDate(message.draft ? message.createdAt : message.sentAt, 'dd/MM/yyyy')}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
)

export default MessageCard
