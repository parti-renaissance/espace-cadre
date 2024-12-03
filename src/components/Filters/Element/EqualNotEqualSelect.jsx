import { FormControl, ListItemText, MenuItem, Select, SvgIcon } from '@mui/material'
import PropTypes from 'prop-types'
import EqualSvg from '~/assets/equal.svg?react'
import NotEqualSvg from '~/assets/not-equal.svg?react'
import { styled } from '@mui/material/styles'

const MySelect = styled(Select)`
  & .MuiSelect-select {
    display: flex;
    align-items: center;
    padding-top: 15.5px;
    padding-bottom: 15.5px;
    padding-right: 46px !important;

    // @TODO: Help Antonin !!
    width: fit-content;
    //white-space: normal;
    //overflow-wrap: break-word;
    //word-break: break-word;

    & .MuiTypography-root {
      font-size: 12px;
    }

    & .equal {
      display: none;
    }
  }
`

const EqualNotEqualSelect = ({ value, onChange }) => (
  <FormControl>
    <MySelect value={value} onChange={onChange}>
      <MenuItem value={1}>
        <SvgIcon component={EqualSvg} />
        <ListItemText primary="Est égal" className={'equal'} />
      </MenuItem>
      <MenuItem value={0}>
        <SvgIcon component={NotEqualSvg} sx={{ color: '#EE2C17' }} />
        <ListItemText primary="Est différent" sx={{ color: '#EE2C17' }} />
      </MenuItem>
    </MySelect>
  </FormControl>
)

export default EqualNotEqualSelect

EqualNotEqualSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
