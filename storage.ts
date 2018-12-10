export class InMemoryStorage {

    private storage: {} = {};

    constructor() {}

    set(key, value) {
        return this.storage[key] = value;
    }

    get(key) {
        return this.storage[key] || "{}";
    }

    delete(key) {
        delete this.storage[key]
    }


}