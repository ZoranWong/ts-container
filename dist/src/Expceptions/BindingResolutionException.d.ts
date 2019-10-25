export default class BindingResolutionException implements Error {
    message: string;
    name: string;
    stack: string;
    constructor(message?: string, name?: string, stack?: string);
}
