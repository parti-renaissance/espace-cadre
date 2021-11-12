// Emotion react (@emotion/react) -> React
// css() retourne un object avec le nom de la classe et d'autres infos (compat  API Emotion, Styled..)
// 1. s'utilise avec la prop 'css'
// 2. obligé d'importer 'jsx' sinon le css n'est pas computé
// SSR = aucun réglage supplémentaire

/* eslint-disable */
/** @jsxImportSource @emotion/react */
import { css, jsx, ClassNames } from '@emotion/react'

const colorRed = 'red'
const isActive = true

const classes = {
  stringLiteral: css`
    height: 25px;
    width: 30%;
    background: lightGrey;
    margin: 5px;
    padding: 5px;
    ${isActive && 'color: blue;'},
  `,
  objectStyle: css({
    height: '25px',
    width: '30%',
    background: 'lightGrey',
    margin: '5px',
    padding: '5px',
    color: colorRed,
  }),
  arrayObject: css([
    { height: '25px', width: '30%' },
    { background: 'lightGrey' },
    { margin: '5px', padding: '5px' },
    isActive && { color: 'blue' },
  ]),
}

const EmotionReact = ({ fontWeight = 'bold' }) => {
  return (
    <>
      <div>
        <div
          css={css`
            text-align: center;
            font-weight: ${fontWeight || 'initial'};
            margin-bottom: 5px;
          `}
        >
          Emotion React
        </div>
        <span css={classes.stringLiteral}>String Literal</span>
        <span css={classes.objectStyle}>Object</span>
        <MyComponent
          css={css`
            color: green;
          `}
          attr="en trop"
        />
      </div>
    </>
  )
}

const MyComponent = ({ className }) => {
  return (
    <ClassNames>
      {({ css, cx }) => <span className={cx(css(classes.arrayObject), className)}>Array of Objects</span>}
    </ClassNames>
  )
}

export default EmotionReact
