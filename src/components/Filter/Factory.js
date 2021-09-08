import FactoryMapper from './FactoryMapper';

class Factory {
    constructor() {
        this.factoryMapper = new FactoryMapper();
    }

    create(type, props) {
        const factory = this.factoryMapper.factory(type);

        return factory && factory.create(props);
    }
}

export default Factory;
