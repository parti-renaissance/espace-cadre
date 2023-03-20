import SelectFactory from './Factory/SelectFactory'
import TextFactory from './Factory/TextFactory'
import DateIntervalFactory from './Factory/DateIntervalFactory'
import IntegerIntervalFactory from './Factory/IntegerIntervalFactory'
import AutocompleteFactory from './Factory/AutocompleteFactory'
import ZoneAutocompleteFactory from './Factory/ZoneAutocompleteFactory'

class FactoryMapper {
  constructor() {
    const selectFactory = new SelectFactory()
    const textFactory = new TextFactory()
    const dateIntervalFactory = new DateIntervalFactory()
    const integerIntervalFactory = new IntegerIntervalFactory()
    const autocompleteFactory = new AutocompleteFactory()
    const zoneAutocompleteFactory = new ZoneAutocompleteFactory()

    this.factories = {}
    this.factories[selectFactory.getType()] = selectFactory
    this.factories[textFactory.getType()] = textFactory
    this.factories[dateIntervalFactory.getType()] = dateIntervalFactory
    this.factories[integerIntervalFactory.getType()] = integerIntervalFactory
    this.factories[autocompleteFactory.getType()] = autocompleteFactory
    this.factories[zoneAutocompleteFactory.getType()] = zoneAutocompleteFactory
  }

  factory(type) {
    return this.factories[type]
  }
}

export default FactoryMapper
