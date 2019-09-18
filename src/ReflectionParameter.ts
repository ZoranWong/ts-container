import {factory} from "./IOC";
import _ = require("lodash");

export default class ReflectionParameter<T> {
    private _class: any = null;
    private _defaultValue: T = null;
    private _name: string = null;
    constructor(parameterClass: any, _defaultValue: T, name: string) {
        this._class = parameterClass;
        this._defaultValue = _defaultValue;
        this._name = name;
    }

    public getClass() {
        return this._class;
    }

    public getClassName() {
        return this._class.name;
    }

    public getDefaultValue() {
        return this._defaultValue;
    }

    public getValue() {
        return this.isDefaultValueAvailable() ? this.getDefaultValue() : this.getParamInstance(this._class);
    }

    /**
     * 获取参数列表
     * @param {Array<Function>} param 参数列表类型数组
     * @return {any}
     * */
    protected getParamInstance (param: any): any {
        if(_.isArray(param)) {
            let paramInstances: Array<any> = param.map((v: Function) => {
                // 参数不可注入
                if (v instanceof Array) {
                    return this.getParamInstance(v as any);
                    // 参数无依赖则直接创建对象
                } else {
                    let param = factory(v);
                    if(param){
                        return param;
                    }
                    return new (v as any)();
                }
            });
            return paramInstances;
        }else{
            let instance = factory(param);
            if(instance){
                return instance;
            }
            return new (param)();
        }

    }

    public isDefaultValueAvailable() {
        return this._defaultValue !== undefined;
    }
}
