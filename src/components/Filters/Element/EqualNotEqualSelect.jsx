import { FormControl, MenuItem, Select, SvgIcon, Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import EqualSvg from '~/assets/equal.svg?react'
import NotEqualSvg from '~/assets/not-equal.svg?react'
import { styled } from '@mui/material/styles'

const MySelect = styled(Select)`
  & .MuiSelect-select {
    padding-top: 15.5px;
    padding-bottom: 15.5px;
    padding-right: 36px !important;
    & .MuiTypography-root {
      font-size: 12px;
    }

    & .equal {
      display: none;
    }
  }
`

const MyItem = styled(Box)`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
`

const EqualNotEqualSelect = ({ value, onChange }) => (
  <Box>
    <FormControl>
      <MySelect value={value} onChange={onChange}>
        <MenuItem value={1}>
          <MyItem>
            <SvgIcon component={EqualSvg} />
            <Typography className={'equal'} secondary letterSpacing={0} fontSize={14} fontWeight={500}>
              Est égal
            </Typography>
          </MyItem>
        </MenuItem>
        <MenuItem value={0}>
          <MyItem>
            <SvgIcon component={NotEqualSvg} sx={{ color: '#EE2C17' }} />
            <Typography sx={{ color: '#EE2C17' }} secondary letterSpacing={0} fontSize={14} fontWeight={500}>
              Est différent
            </Typography>
          </MyItem>
        </MenuItem>
      </MySelect>
    </FormControl>
  </Box>
)

export default EqualNotEqualSelect

EqualNotEqualSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
