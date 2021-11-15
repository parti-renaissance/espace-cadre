// MUI styled + sx prop
// Styled fonctionnement identique à Emotion styled
// Sx prop = rajout de style en rapide (accès au theme)

/* eslint-disable */
import isPropValid from '@emotion/is-prop-valid'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

const propsAreNotAttributes = ['color', 'bold']
const avoidPropsAsAttributes = {
  shouldForwardProp: prop => isPropValid(prop) && !propsAreNotAttributes.includes(prop),
}

const Title = styled(props => <Typography component="div" {...props} />, {
  shouldForwardProp: prop => isPropValid(prop) && prop !== 'bold',
})`
  margin-bottom: 5px;
  text-align: center;
  font-weight: ${({ bold }) => (bold === true ? 'bold' : 'initial')};
`

const Element = styled(
  Typography,
  avoidPropsAsAttributes
)({
  height: '25px',
  margin: '5px',
  padding: '10px',
  background: 'lightGrey',
  borderRadius: '8px',
})

const StringLiteral = styled(Element)`
  ${({ isActive }) => isActive && 'color: blue;'},
`

const ObjectStyle = styled(Element)(({ color }) => ({ color }))

const ElementComponent = ({ className, children, ...props }) => {
  return (
    <Element className={className} {...props}>
      {children}
    </Element>
  )
}

const ArrayObject = styled(
  ElementComponent,
  avoidPropsAsAttributes
)(() => [({ isActive, color }) => ({ color: isActive && (color || 'blue') }), { border: '1px solid darkblue' }])

const MUIStyled = ({ fontWeight = 'bold' }) => {
  return (
    <Grid>
      <Title bold={!!fontWeight}>MUI Styled</Title>
      <Grid container justifyContent="center">
        <StringLiteral
          isActive
          sx={{
            border: theme => `1px solid ${theme.palette.blue600}`,
          }}
        >
          String Literal
        </StringLiteral>
        <ObjectStyle color="red">Object Style</ObjectStyle>
        <ArrayObject isActive color="green" attr="en trop">
          Array of Objects
        </ArrayObject>
      </Grid>
    </Grid>
  )
}

export default MUIStyled
