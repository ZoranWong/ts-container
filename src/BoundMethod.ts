import Container from './Container';
import { Closure } from './Utils/Types';
import _ from 'lodash';
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
     * @return mixed
     */
    public static call(container: Container, callback: Closure, parameters: Array<any> = [], defaultMethod = null) {
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
     * @param  string  target
     * @param  array parameters
     * @param  string|null  defaultMethod
     * @return mixed
     *
     * @throws \InvalidArgumentException
     */
    protected static callClass(container: Container, target, parameters: Array<any> = [], defaultMethod = null) {

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
            return _.isFunction(defaultCallback) ? defaultCallback() : defaultCallback;
        }

        // Here we need to turn the array callable into a Class@method string we can use to
        // examine the container and see if there are any method bindings for this given
        // method. If there are, we can call this method binding callback immediately.
        let method = BoundMethod.normalizeMethod(callback);

        if (container.hasMethodBinding(method)) {
            return container.callMethodBinding(method, callback[0]);
        }

        return _.isFunction(defaultCallback) ? defaultCallback() : defaultCallback;
    }

    /**
     * Normalize the given callback into a Class@method string.
     *
     * @param  callable  $callback
     * @return string
     */
    protected static normalizeMethod(callback: any) {
        return _.isString(callback[0]) ? "{$callback[0]}@{$callback[1]}" : callback[0][callback[1]];
    }

    /**
     * Get all dependencies for a given method.
     *
     * @param  Container  $container
     * @param  callable|string  $callback
     * @param  array  $parameters
     * @return array
     */
    protected static getMethodDependencies(container: Container, callback, parameters: Array<any> = []) {
        let dependencies: Array<any> = [];

    }

    /**
     * Get the proper reflection instance for the given callback.
     *
     * @param  callable|string  $callback
     * @return \ReflectionFunctionAbstract
     */
    protected static getCallReflector(callback) {

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
    protected static addDependencyForCallParameter(container: Container, parameter, parameters: Array<any>, dependencies: Array<any>) {

    }

    /**
     * Determine if the given string is in Class@method syntax.
     *
     * @param  any  callback
     * @return bool
     */
    protected static isCallableWithAtSign(callback) {
        return _.isString(callback) && callback.indexOf('@') !== -1;
    }
}
