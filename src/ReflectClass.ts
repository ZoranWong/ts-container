import {ctorParamMetadata} from './Utils/Types';
import ReflectionParameter from './ReflectionParameter';
import IOCError from "./Expceptions/IOCError";
import ReflectionFunction from "./ReflectionFunction";
export default class ReflectionClass extends ReflectionFunction{
    protected _className: string = null;

    constructor($class: any) {
        super($class);
        this._className = this._callback.name;
    }

    protected  paramParse (): any[] {
        return ctorParamMetadata(this._callback);
    }
}
