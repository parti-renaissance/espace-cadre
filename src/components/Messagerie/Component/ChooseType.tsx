import { Card, CardContent, CardHeader, Typography } from '@mui/material'

export const CHOOSE_TYPE_TEST_ID = 'ChooseType'

export interface ChooseTypeProps<D extends { id: string | number }>
  extends Omit<React.ComponentProps<typeof Card>, 'onChange'> {
  data: D[]
  render: (args: { selected: boolean; data: D }) => React.ReactNode
  onChange: (id: D['id']) => void
  value: D['id']
  container?: (props: { children: React.ReactNode }) => JSX.Element
}

function ChooseType<D extends { id: string | number }>({
  data,
  render,
  onChange,
  value,
  container: Container = ({ children }) => <>{children}</>,
  ...cardProps
}: ChooseTypeProps<D>) {
  return (
    <Card {...cardProps} data-testid={CHOOSE_TYPE_TEST_ID}>
      <CardContent>
        <Container>
          {data.map(d => (
            <div key={d.id} onClick={() => onChange(d.id)}>
              {render({ selected: d.id === value, data: d })}
            </div>
          ))}
        </Container>
      </CardContent>
    </Card>
  )
}

export default ChooseType
