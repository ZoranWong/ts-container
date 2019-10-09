"use strict";
import {ctorParamMetadata, isClass} from './Utils/Types';
import ReflectFunction from "./ReflectFunction";
import Ctor from "./Contracts/Ctor";
export default class ReflectClass extends ReflectFunction{
    protected _className: string = null;

    constructor($class: any) {
        super($class);
        this._className = this._callback.name;
    }

    protected  paramParse (): any[] {
        return ctorParamMetadata(this._callback);
    }

    public getConstructor(): Ctor<any> {
        return this._callback as Ctor<any>;
    }

    public isInstantiable() : boolean {
        return isClass(this._callback);
    }
}
