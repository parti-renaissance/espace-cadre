import { Card, CardContent, CardHeader, Typography } from '@mui/material'

export const TYPE_CARD_TEST_ID = 'TypeCard'

interface TypeCardProps extends React.ComponentProps<typeof Card> {
  title: string
  subTitle: string
  description: string
  icon: React.ReactNode
}

function TypeCard({ title, subTitle, description, icon, ...cardProps }: TypeCardProps) {
  return (
    <Card {...cardProps} data-testid={TYPE_CARD_TEST_ID}>
      <CardHeader title={title} subheader={subTitle} avatar={icon} />
      <CardContent>
        <Typography variant="body2">{description}</Typography>
      </CardContent>
    </Card>
  )
}

export default TypeCard
