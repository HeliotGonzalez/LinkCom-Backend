export class CriteriaBuilderFactory {
    constructor() {
        this.builders = {};
    }

    put(key, builder) {
        this.builders[key] = builder;
        return this;
    }

    get(key) {
        return this.builders[key];
    }
}