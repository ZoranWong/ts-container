"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Utils/Types");
const _ = require("lodash");
const InvalidArgumentException_1 = require("./Expceptions/InvalidArgumentException");
const Global = this;
// BoundMethod主要是为方法绑定相应实例
class BoundMethod {
    /**
     * Call the given Closure / class@method and inject its dependencies.
     *
     * @param  Container  container
     * @param  callable|string  $callback
     * @param  array  $parameters
     * @param  string|null  $defaultMethod
     * @return any
     */
    static call(container, callback, parameters = [], defaultMethod = null) {
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
    static callClass(container, target, parameters = [], defaultMethod = null) {
        let segments = target.split('@');
        let method = segments.length === 2 ? segments[1] : defaultMethod;
        if (_.isNull(method)) {
            throw new InvalidArgumentException_1.default('Method not provided.');
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
    static callBoundMethod(container, callback, defaultCallback) {
        if (!_.isArray(callback)) {
            return Types_1.isClosure(defaultCallback) ? defaultCallback() : defaultCallback;
        }
        // Here we need to turn the array callable into a Class@method string we can use to
        // examine the container and see if there are any method bindings for this given
        // method. If there are, we can call this method binding callback immediately.
        let method = BoundMethod.normalizeMethod(callback);
        if (container.hasMethodBinding(method)) {
            return container.callMethodBinding(method, callback[0]);
        }
        return Types_1.isClosure(defaultCallback) ? defaultCallback() : defaultCallback;
    }
    /**
     * Normalize the given callback into a Class@method string.
     *
     * @param  callable  $callback
     * @return string
     */
    static normalizeMethod(callback) {
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
    static getMethodDependencies(container, callback, parameters = []) {
        let dependencies = [];
    }
    /**
     * Get the proper reflection instance for the given callback.
     *
     * @param  callable|string  $callback
     * @return \ReflectionFunctionAbstract
     */
    static getCallReflector(callback) {
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
    static addDependencyForCallParameter(container, parameter, parameters, dependencies) {
    }
    /**
     * Determine if the given string is in Class@method syntax.
     *
     * @param  any  callback
     * @return bool
     */
    static isCallableWithAtSign(callback) {
        return _.isString(callback) && callback.indexOf('@') !== -1;
    }
}
exports.default = BoundMethod;
