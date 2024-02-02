import { Grid, TextField as MuiTextField } from '@mui/material'
import { styled } from '@mui/system'

const TextField = styled(MuiTextField)`
  width: 100%;
`
class IntegerIntervalFactory {
  getType() {
    return 'integer_interval'
  }

  create({ filter, onChange, value }) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label={`${filter.label} minimum`}
            type="number"
            name={filter.code}
            InputProps={{ inputProps: filter.options?.first }}
            variant="outlined"
            value={value === '' || (typeof value === 'object' && value.min === undefined) ? '' : value.min}
            onChange={e => {
              const min = e.target.value
              if (min === '') {
                onChange(value.max !== undefined ? { max: value.max } : null)
              } else {
                onChange({ ...value, ...{ min: parseInt(min, 10) } })
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={`${filter.label} maximum`}
            type="number"
            name={filter.code}
            InputProps={{ inputProps: filter.options?.second }}
            size="small"
            variant="outlined"
            value={value === '' || (typeof value === 'object' && value.max === undefined) ? '' : value.max}
            onChange={e => {
              const max = e.target.value
              if (max === '') {
                onChange(value.min !== undefined ? { min: value.min } : null)
              } else {
                onChange({ ...value, ...{ max: parseInt(max, 10) } })
              }
            }}
          />
        </Grid>
      </Grid>
    )
  }
}

export default IntegerIntervalFactory
