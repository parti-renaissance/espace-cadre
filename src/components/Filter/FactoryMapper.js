import SelectFactory from './Factory/SelectFactory';
import TextFactory from './Factory/TextFactory';

class FactoryMapper {
    constructor() {
        const selectFactory = new SelectFactory();
        const textFactory = new TextFactory();

        this.factories = {};
        this.factories[selectFactory.getType()] = selectFactory;
        this.factories[textFactory.getType()] = textFactory;
    }

    factory(type) {
        return this.factories[type];
    }
}

export default FactoryMapper;
