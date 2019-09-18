export default class ReflectionClass {
    private _class;
    private _className;
    private _parameters;
    constructor($class: any);
    getParameters(): any[];
}
