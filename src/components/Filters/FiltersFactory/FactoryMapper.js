import SelectFactory from './Factory/SelectFactory';
import TextFactory from './Factory/TextFactory';
import DatePickerFactory from './Factory/DatePickerFactory';

class FactoryMapper {
    constructor() {
        const selectFactory = new SelectFactory();
        const textFactory = new TextFactory();
        const datePickerFactory = new DatePickerFactory();

        this.factories = {};
        this.factories[selectFactory.getType()] = selectFactory;
        this.factories[textFactory.getType()] = textFactory;
        this.factories[datePickerFactory.getType()] = datePickerFactory;
    }

    factory(type) {
        return this.factories[type];
    }
}

export default FactoryMapper;
