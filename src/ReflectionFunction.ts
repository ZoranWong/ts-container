import {Closure, ctorParamMetadata} from './Utils/Types';
import ReflectionParameter from './ReflectionParameter';
import IOCError from "./Expceptions/IOCError";
export default class ReflectionFunction {
    protected _callback: Closure = null;

    protected _parameters: Array<ReflectionParameter<any>> = [];

    constructor(callback: Closure) {
        this._callback = callback;
        let params: Array<any> = this.paramParse();
        let paramTypes: Array<Function> = Reflect.getMetadata('design:paramtypes', this._callback);
        params.forEach((value, index) => {
            let paramType = paramTypes[index];
            if(paramType === this._callback) {
                throw  new IOCError('不可以依赖自身');
            }
            let parameter = new ReflectionParameter<typeof paramType>(paramType, value['value'], value['name']);
            this._parameters.push(parameter);
        });
    }

    public getParameters() {
        return this._parameters.map((param: ReflectionParameter<any>) => {
            return param.getValue();
        });
    }

    protected paramParse(): any[] {
        return [];
    }
}
