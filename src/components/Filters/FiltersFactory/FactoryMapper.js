import SelectFactory from './Factory/SelectFactory';
import TextFactory from './Factory/TextFactory';
import DateIntervalFactory from './Factory/DateIntervalFactory';
import AgeIntervalFactory from './Factory/AgeIntervalFactory';

class FactoryMapper {
    constructor() {
        const selectFactory = new SelectFactory();
        const textFactory = new TextFactory();
        const dateIntervalFactory = new DateIntervalFactory();
        const ageIntervalFactory = new AgeIntervalFactory();

        this.factories = {};
        this.factories[selectFactory.getType()] = selectFactory;
        this.factories[textFactory.getType()] = textFactory;
        this.factories[dateIntervalFactory.getType()] = dateIntervalFactory;
        this.factories[ageIntervalFactory.getType()] = ageIntervalFactory;
    }

    factory(type) {
        return this.factories[type];
    }
}

export default FactoryMapper;
