import isPropValid from '@emotion/is-prop-valid'

export const shouldForwardProps = {
  shouldForwardProp: prop => isPropValid(prop),
}
