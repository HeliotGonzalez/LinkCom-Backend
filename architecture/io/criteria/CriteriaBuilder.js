export class CriteriaBuilder {
    key;
    value;
    criterion;

    static create() {
        return new CriteriaBuilder();
    }

    withCriterion(criterion) {
        this.criterion = criterion;
        return this;
    }

    withKey(key) {
        this.key = key;
        return this;
    }

    withValue(value) {
        this.value = value;
        return this;
    }

    build() {
        return new this.criterion(this.key, this.value);
    }
}