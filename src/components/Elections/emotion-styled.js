// Emotion styled (@emotion/styled) -> React/Styled Components
// styled() permet de wrapper un tag HTML ou un composant et le restyliser
// 1. éviter souvent de définir soi-même un className (généré comme makeStyles)
// 2. supporte toutes les fonctionnalités de styled-components
// SSR = aucun réglage supplémentaire

/* eslint-disable */
import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  text-align: center;
`

const Title = styled('div')`
  margin-bottom: 20px;
  text-align: center;
  font-weight: ${({ bold }) => (bold === true ? 'bold' : 'initial')};
`

const Element = styled.span`
  height: 25px;
  width: 30%;
  margin: 5px;
  padding: 10px;
  background: lightGrey;
  border-radius: 8px;
`

const StringLiteral = styled(Element)`
  ${({ isActive }) => isActive && 'color: blue;'},
`

const ObjectStyle = styled(Element, { shouldForwardProp: prop => isPropValid(prop) && prop !== 'color' })(
  ({ color }) => ({ color })
)

const ElementComponent = ({ className, children, ...props }) => {
  return (
    <Element className={className} {...props}>
      {children}
    </Element>
  )
}

const ArrayObject = styled(ElementComponent, { shouldForwardProp: prop => isPropValid(prop) && prop !== 'color' })(
  ({ isActive, color }) => ({ color: isActive && (color || 'blue') }),
  { border: '1px solid darkblue' }
)

const EmotionStyled = ({ fontWeight = 'bold' }) => {
  return (
    <>
      <Wrapper>
        <Title bold={!!fontWeight}>Emotion Styled</Title>
        <StringLiteral isActive>String Literal</StringLiteral>
        <ObjectStyle color="red">String Literal</ObjectStyle>
        <ArrayObject isActive color="green">
          Array of Objects
        </ArrayObject>
      </Wrapper>
    </>
  )
}

export default EmotionStyled
