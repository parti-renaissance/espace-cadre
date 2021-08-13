import SelectFactory from './Factory/SelectFactory';
import TextFactory from './Factory/TextFactory';
import MultiSelectFactory from './Factory/MultiSelectFactory';

class FactoryMapper {
    constructor() {
        const selectFactory = new SelectFactory();
        const multiSelectFactory = new MultiSelectFactory();
        const textFactory = new TextFactory();

        this.factories = {};
        this.factories[selectFactory.getType()] = selectFactory;
        this.factories[multiSelectFactory.getType()] = new MultiSelectFactory();
        this.factories[textFactory.getType()] = textFactory;
    }

    factory(type) {
        return this.factories[type];
    }
}

export default FactoryMapper;
