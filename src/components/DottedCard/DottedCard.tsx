import styled from '@emotion/styled'
import { grey } from '~/theme/palette'
import { CssSpacing } from '~/theme/spacing'

const DottedCard = styled.div({
  border: `1px dashed ${grey[300]}`,
  backgroundColor: grey[100],
  padding: CssSpacing.large,
  borderRadius: 8,
  marginTop: CssSpacing.large,
})

export default DottedCard
