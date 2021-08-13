import FactoryMapper from './FactoryMapper';

class Factory {
    constructor() {
        this.factoryMapper = new FactoryMapper();
    }

    create(props) {
        const { type } = props;
        const factory = this.factoryMapper.factory(type);

        return factory && factory.create(props);
    }
}

export default Factory;
