export default class IOCError implements Error {
    message: string;
    name: string;
    stack: string;
    constructor(message?: string, name?: string, stack?: string);
}
