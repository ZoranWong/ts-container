"use strict";
import {Closure, ctorParamMetadata} from './Utils/Types';
import ReflectParameter from './ReflectParameter';
import IOCError from "./Expceptions/IOCError";
export default class ReflectFunction {
    protected _callback: Closure = null;

    protected _parameters: Array<ReflectParameter<any>> = [];

    constructor(callback: Closure) {
        this._callback = callback;
        let params: Array<any> = this.paramParse();
        let paramTypes: Array<Function> = Reflect.getMetadata('design:paramtypes', this._callback);
        params.forEach((value, index) => {
            let paramType = paramTypes[index];
            if(paramType === this._callback) {
                throw  new IOCError('不可以依赖自身');
            }
            let parameter = new ReflectParameter<typeof paramType>(paramType, value['value'], value['name']);
            this._parameters.push(parameter);
        });
    }

    public getParameters() {
        return this._parameters.map((param: ReflectParameter<any>) => {
            return param.getValue();
        });
    }

    protected paramParse(): any[] {
        return ctorParamMetadata(this._callback);
    }
}
