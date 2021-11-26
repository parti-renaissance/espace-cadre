import { styled } from '@mui/system'
import Percentage from 'ui/Percentage'
import PropTypes from 'prop-types'

const Container = styled('div')(
  ({ theme }) => `
   display: flex;
   flex-direction: column;
   padding: ${theme.spacing(2)};
`
)

const RateNumber = styled('div')`
  display: flex;
`

const Rate = styled('div')(
  ({ theme }) => `
  color: ${theme.palette.blueCorner};
  font-size: 16px;
  font-weight: 600;
`
)
const Number = styled('div')(
  ({ theme }) => `
  font-weight: 400;
  color: ${theme.palette.grayCorner3};
  margin-left: ${theme.spacing(0.25)};
`
)
const Label = styled('div')(
  ({ theme }) => `
  font-size: 12px;
  font-weight: 400;
  color: ${theme.palette.grayCorner3};
`
)

const Stat = ({ rate, number, label, wrapNumber = true }) => (
  <Container>
    <RateNumber>
      {rate !== null && rate !== undefined && (
        <Rate>
          <Percentage>{rate}</Percentage>
        </Rate>
      )}
      <Number>
        {wrapNumber && '('}
        {number}
        {wrapNumber && ')'}
      </Number>
    </RateNumber>
    <Label>
      {label}
      {number > 1 && 's'}
    </Label>
  </Container>
)
Stat.propTypes = {
  rate: PropTypes.number,
  number: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  wrapNumber: PropTypes.bool,
}

export default Stat
