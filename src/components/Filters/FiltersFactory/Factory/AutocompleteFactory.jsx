import { createStyles, FormControl, makeStyles } from '@material-ui/core'
import Autocomplete from '../../Element/Autocomplete'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      fontFamily: 'Poppins',
      width: '100%',
    },
  })
)

class AutocompleteFactory {
  getType() {
    return 'autocomplete'
  }

  create({ filter, onChange, value, defaultValue }) {
    const classes = useStyles()

    return (
      <FormControl size="small" classes={{ root: classes.root }}>
        <Autocomplete
          placeholder={filter.label}
          uri={filter.options.url}
          value={value} //
          onChange={onChange}
          queryParam={filter.options.query_param} // q
          valueParam={filter.options.value_param} // uuid
          labelParam={filter.options.label_param} // name
          required={filter.options.required || false} //true
          multiple={filter.options.multiple} // false
          getOptionLabel={option => option[filter.options.label_param]}
          defaultValue={defaultValue}
        />
      </FormControl>
    )
  }
}

export default AutocompleteFactory
