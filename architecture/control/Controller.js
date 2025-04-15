/**
 * @interface
 */
export class Controller {
    async put() {
        throw new Error('Method not implemented');
    }

    async get() {
        throw new Error('Method not implemented');
    }

    async patch() {
        throw new Error('Method not implemented');
    }

    async delete() {
        throw new Error('Method not implemented');
    }

    handleError() {
        throw new Error('Method not implemented');
    }
}