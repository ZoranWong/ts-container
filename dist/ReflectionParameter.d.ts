export default class ReflectionParameter<T> {
    private _class;
    private _defaultValue;
    private _name;
    constructor(parameterClass: any, _defaultValue: T, name: string);
    getClass(): any;
    getClassName(): any;
    getDefaultValue(): T;
    getValue(): any;
    /**
     * 获取参数列表
     * @param {Array<Function>} param 参数列表类型数组
     * @return {any}
     * */
    protected getParamInstance(param: any): any;
    isDefaultValueAvailable(): boolean;
}
