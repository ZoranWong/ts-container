"use strict";
import {Closure, ctorParamMetadata, isClass} from './Utils/Types';
import ReflectFunction from "./ReflectFunction";
import Ctor from "./Contracts/Ctor";
import * as _ from 'lodash';
export default class ReflectClass extends ReflectFunction{
    protected _className: string = null;

    protected _namespace: string = null;

    protected _path: string = null;

    constructor($class: Closure| string) {
        super($class instanceof Function ? $class : (() => {$class}));
        if(_.isString($class)) {
            let data = require($class as string);
            if(data) {
                this._callback = data['default'];
            }
        }
        let constructor: any = this._callback;
        this._namespace = constructor['namespace'];
        this._path = constructor['path'];
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
