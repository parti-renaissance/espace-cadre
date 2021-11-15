// Emotion basic (@emotion/css) -> Framework agnostic
// css() retourne une string avec la classe computée (comme makeStyles)
// 1. s'utilise avec la prop 'className'
// 2. pas de passage de prop si défini en dehors du render
// SSR = réglages à faire en plus

/* eslint-disable */
import { css, cx } from '@emotion/css'

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

const EmotionBasic = ({ fontWeight = 'bold' }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        className={css`
          text-align: center;
          font-weight: ${fontWeight || 'initial'};
          margin-bottom: 5px;
        `}
      >
        Emotion Basic
      </div>
      <span className={classes.stringLiteral}>String Literal</span>
      <span className={classes.objectStyle}>Object</span>
      <MyComponent
        className={css`
          color: green;
        `}
      />
    </div>
  )
}

const MyComponent = ({ className, ...props }) => (
  <span className={cx(classes.arrayObject, className)} {...props}>
    Array of Objects
  </span>
)

export default EmotionBasic
