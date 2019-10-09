export default class BindingResolutionException implements Error {
    message: string;
    name: string;
    stack: string;

    public constructor(message: string = '', name: string = '', stack: string = '') {
        this.message =  message;
        this.name = name;
        this.stack = stack;
    }
}
