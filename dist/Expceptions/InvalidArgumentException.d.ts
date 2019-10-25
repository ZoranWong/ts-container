export default class InvalidArgumentException implements Error {
    message: string;
    name: string;
    stack: string;
    constructor(message?: string, name?: string, stack?: string);
}
