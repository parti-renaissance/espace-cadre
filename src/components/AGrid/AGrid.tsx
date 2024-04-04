import { Grid } from '@mui/material'
import styled from '@emotion/styled'

/**
 * Component used as animation container
 */
const AGrid = styled(Grid)`
  .item-enter {
    opacity: 0;
  }
  .item-enter-active {
    opacity: 1;
    transition: opacity 500ms ease-in;
  }
  .item-exit {
    opacity: 1;
  }
  .item-exit-active {
    opacity: 0;
    transition: opacity 500ms ease-in;
  }
`

export default AGrid
