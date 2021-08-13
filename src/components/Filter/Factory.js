import FactoryMapper from './FactoryMapper';

class Factory {
    constructor() {
        this.factoryMapper = new FactoryMapper();
    }

    create(type, column, value, onChange) {
        const factory = this.factoryMapper.factory(type);

        return factory && factory.create({ column, value, onChange });
    }
}

export default Factory;
