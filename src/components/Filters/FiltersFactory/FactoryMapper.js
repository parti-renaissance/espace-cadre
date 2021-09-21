import SelectFactory from './Factory/SelectFactory';
import TextFactory from './Factory/TextFactory';
import DateIntervalFactory from './Factory/DateIntervalFactory';
import IntegerIntervalFactory from './Factory/IntegerIntervalFactory';

class FactoryMapper {
    constructor() {
        const selectFactory = new SelectFactory();
        const textFactory = new TextFactory();
        const dateIntervalFactory = new DateIntervalFactory();
        const integerIntervalFactory = new IntegerIntervalFactory();

        this.factories = {};
        this.factories[selectFactory.getType()] = selectFactory;
        this.factories[textFactory.getType()] = textFactory;
        this.factories[dateIntervalFactory.getType()] = dateIntervalFactory;
        this.factories[integerIntervalFactory.getType()] = integerIntervalFactory;
    }

    factory(type) {
        return this.factories[type];
    }
}

export default FactoryMapper;
