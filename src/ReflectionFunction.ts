import { Closure } from './Utils/Types';
import ReflectionParameter from './ReflectionParameter';
export default class ReflectionFunction {
    protected _callback: Closure = null;

    protected _parameters: Array<ReflectionParameter<any>> = [];

    constructor(callback: Closure) {
        this._callback = callback;
    }

    public getParameters() {
        return this._parameters.map((param: ReflectionParameter<any>) => {
            return param.getValue();
        });
    }
}
