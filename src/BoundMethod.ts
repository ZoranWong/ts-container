"use strict";
import Container from './Container';
import {Closure, isClosure} from './Utils/Types';
import * as _ from 'lodash';
import InvalidArgumentException from "./Expceptions/InvalidArgumentException";
const Global = this;
// BoundMethod主要是为方法绑定相应实例
export default class BoundMethod {
    /**
     * Call the given Closure / class@method and inject its dependencies.
     *
     * @param  Container  container
     * @param  callable|string  $callback
     * @param  array  $parameters
     * @param  string|null  $defaultMethod
     * @return any
     */
    public static call(container: Container, callback: any, parameters: Array<any> = [], defaultMethod: any = null):any {
        if (BoundMethod.isCallableWithAtSign(callback) || defaultMethod) {
            return BoundMethod.callClass(container, callback, parameters, defaultMethod);
        }

        return BoundMethod.callBoundMethod(container, callback, () => {
            return callback.apply(Global, BoundMethod.getMethodDependencies(container, callback, parameters));
        });
    }

    /**
     * Call a string reference to a class using Class@method syntax.
     *
     * @param  Container  container
     * @param  any  target
     * @param  array parameters
     * @param  string|null  defaultMethod
     * @return any
     *
     * @throws \InvalidArgumentException
     */
    protected static callClass(container: Container, target: any, parameters: Array<any> = [], defaultMethod: any = null): any {
        let segments: Array<string> = target.split('@');
        let method: string = segments.length === 2 ? segments[1] : defaultMethod;
        if(_.isNull(method)) {
            throw new InvalidArgumentException('Method not provided.');
        }

        return BoundMethod.call(container, [container.make(segments[0]), method], parameters);
    }

    /**
     * Call a method that has been bound to the container.
     *
     * @param  Container  container
     * @param  callable  defaultCallback
     * @param  any  default
     * @return mixed
     */
    protected static callBoundMethod(container: Container, callback: Closure, defaultCallback: any) {
        if (!_.isArray(callback)) {
            return isClosure(defaultCallback) ? defaultCallback() : defaultCallback;
        }

        // Here we need to turn the array callable into a Class@method string we can use to
        // examine the container and see if there are any method bindings for this given
        // method. If there are, we can call this method binding callback immediately.
        let method = BoundMethod.normalizeMethod(callback);

        if (container.hasMethodBinding(method)) {
            return container.callMethodBinding(method, (callback as any)[0]);
        }

        return isClosure(defaultCallback) ? defaultCallback() : defaultCallback;
    }

    /**
     * Normalize the given callback into a Class@method string.
     *
     * @param  callable  $callback
     * @return string
     */
    protected static normalizeMethod(callback: any) {
        return _.isString(callback[0]) ? `${callback[0]}@${callback[1]}` : callback[0][callback[1]];
    }

    /**
     * Get all dependencies for a given method.
     *
     * @param  Container  $container
     * @param  callable|string  $callback
     * @param  array  $parameters
     * @return array
     */
    protected static getMethodDependencies(container: Container, callback: any, parameters: Array<any> = []) {
        let dependencies: Array<any> = [];

    }

    /**
     * Get the proper reflection instance for the given callback.
     *
     * @param  callable|string  $callback
     * @return \ReflectionFunctionAbstract
     */
    protected static getCallReflector(callback: any) {

    }

    /**
     * Get the dependency for the given call parameter.
     *
     * @param  Container  $container
     * @param  Reflect  $parameter
     * @param  array  $parameters
     * @param  array  $dependencies
     * @return mixed
     */
    protected static addDependencyForCallParameter(container: Container, parameter: any, parameters: Array<any>, dependencies: Array<any>) {

    }

    /**
     * Determine if the given string is in Class@method syntax.
     *
     * @param  any  callback
     * @return bool
     */
    protected static isCallableWithAtSign(callback: any) {
        return _.isString(callback) && callback.indexOf('@') !== -1;
    }
}
