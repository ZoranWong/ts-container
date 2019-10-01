"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Utils/Types");
const ContextualBindingBuilder_1 = require("./ContextualBindingBuilder");
const _ = require("lodash");
const Stack_1 = require("./Contracts/Stack");
const array_1 = require("./Utils/array");
const StrKeyMap_1 = require("./StrKeyMap");
class Container {
    constructor() {
        /**
         * An array of the types that have been resolved.
         *
         * @var Map<string, any> _resolved
         */
        this._resolved = new StrKeyMap_1.default();
        /**
         * The container's bindings.
         *
         * @var array
         */
        this._bindings = new StrKeyMap_1.default();
        /**
         * The container's method bindings.
         *
         * @var array
         */
        this._methodBindings = new StrKeyMap_1.default();
        /**
         * The container's shared instances.
         *
         * @var array
         */
        this._instances = new StrKeyMap_1.default();
        /**
         * The registered type aliases.
         *
         * @var array
         */
        this._aliases = new StrKeyMap_1.default();
        /**
         * The registered aliases keyed by the $abstract name.
         *
         * @var array
         */
        this._$abstractAliases = new StrKeyMap_1.default();
        /**
         * The extension closures for services.
         *
         * @var array
         */
        this._extenders = new StrKeyMap_1.default();
        /**
         * All of the registered tags.
         *
         * @var array
         */
        this._tags = new StrKeyMap_1.default();
        /**
         * The stack of concretions currently being built.
         *
         * @var array
         */
        this._buildStack = new Stack_1.default();
        /**
         * The parameter override stack.
         *
         * @var array
         */
        this._with = [];
        /**
         * The contextual binding map.
         *
         * @var array
         */
        this._contextual = [];
        /**
         * All of the registered rebound callbacks.
         *
         * @var array
         */
        this._reboundCallbacks = new StrKeyMap_1.default();
        /**
         * All of the global resolving callbacks.
         *
         * @var array
         */
        this._globalResolvingCallbacks = [];
        /**
         * All of the global after resolving callbacks.
         *
         * @var array
         */
        this._globalAfterResolvingCallbacks = [];
        /**
         * All of the resolving callbacks by class type.
         *
         * @var array
         */
        this._resolvingCallbacks = [];
        /**
         * All of the after resolving callbacks by class type.
         *
         * @var array
         */
        this._afterResolvingCallbacks = [];
    }
    get(id) {
        if (this.has(id)) {
            return this.resolve(id);
        }
        return null;
    }
    resolve($abstract, parameters = []) {
        $abstract = this.getAlias($abstract);
        let needsContextualBuild = (parameters.length > 0 || !_.isEmpty(this.getContextualConcrete($abstract)));
        if (!_.isEmpty(this._instances.get($abstract)) && !needsContextualBuild) {
            return this._instances.get($abstract);
        }
        this._with.push(parameters);
        let concrete = this.getConcrete($abstract);
        let object = concrete();
        let extenders = this.getExtenders($abstract) ? this.getExtenders($abstract) : [];
        extenders.forEach(($extender) => {
            object = $extender(object, this);
        });
        if (this.isShared($abstract) && !needsContextualBuild) {
            this._instances.set($abstract, object);
        }
        this.fireResolvingCallbacks($abstract, object);
        this._resolved.set($abstract, true);
        this._with.pop();
        return object;
    }
    addContextualBinding($concrete, $abstract, $implementation) {
        this._contextual[$concrete][this.getAlias($abstract)] = $implementation;
    }
    /**
     * Determine if the container has a method binding.
     *
     * @return boolean
     * @param method
     */
    hasMethodBinding(method) {
        return !_.isNull(this._methodBindings.get(method));
    }
    /**
     * Get the method binding for the given method.
     *
     * @return any
     * @param method
     * @param instance
     */
    callMethodBinding(method, instance) {
        return this._methodBindings.get(method).apply(instance, this);
    }
    /**
     * Fire all of the resolving callbacks.
     *
     * @return void
     * @param $abstract
     * @param object
     */
    fireResolvingCallbacks($abstract, object) {
        this.fireCallbackArray(object, this._globalResolvingCallbacks);
        this.fireCallbackArray(object, this.getCallbacksForType($abstract, object, this._resolvingCallbacks));
        this.fireAfterResolvingCallbacks($abstract, object);
    }
    fireAfterResolvingCallbacks($abstract, object) {
        this.fireCallbackArray(object, this._globalAfterResolvingCallbacks);
        this.fireCallbackArray(object, this.getCallbacksForType($abstract, object, this._afterResolvingCallbacks));
    }
    getCallbacksForType($abstract, object, callbacksForType) {
        let results = [];
        callbacksForType.forEach((callbacks, type) => {
            if (type === $abstract || Types_1.isTypeOf(object, type)) {
                results = results.concat(callbacks);
            }
        });
        return results;
    }
    fireCallbackArray(object, callbacks) {
        callbacks.forEach((callback) => {
            callback instanceof Function && (callback = [callback]);
            callback.forEach((fn) => {
                fn(object, this);
            });
        });
    }
    isShared($abstract) {
        let binding = this._bindings.get($abstract);
        return !_.isEmpty(this._instances.get($abstract)) && !_.isUndefined(this._instances.get($abstract))
            || (!_.isUndefined(binding) && !_.isEmpty(binding) && !_.isUndefined(binding.concrete)
                && binding.shared === true);
    }
    /**
     * Get the extender callbacks for a given type.
     *
     * @return array
     * @param $abstract
     */
    getExtenders($abstract) {
        $abstract = this.getAlias($abstract);
        if (!this._extenders.get($abstract)) {
            return this._extenders.get($abstract);
        }
        return [];
    }
    /**
     * Get the concrete type for a given $abstract.
     *
     * @param  {string}  $abstract
     * @return {any}   concrete
     */
    getConcrete($abstract) {
        let concrete = this.getContextualConcrete($abstract);
        if (!_.isUndefined(concrete) && !_.isNull(concrete)) {
            return concrete;
        }
        let binding = this._bindings.get($abstract);
        if (!_.isUndefined(binding) && !_.isNull(binding)) {
            return binding.concrete;
        }
        return $abstract;
    }
    /**
     * Get the contextual concrete binding for the given $abstract.
     *
     * @return string|null
     * @param $abstract
     */
    getContextualConcrete($abstract) {
        let binding = this.findInContextualBindings($abstract);
        if (!_.isUndefined(binding) && !_.isNull(binding)) {
            return binding;
        }
        // Next we need to see if a contextual binding might be bound under an alias of the
        // given $abstract type. So, we will need to check if any aliases exist with this
        // type and then spin through them and check for contextual bindings on these.
        if (_.isEmpty(this._$abstractAliases.get($abstract))) {
            return null;
        }
        let $abstractAlias = this._$abstractAliases.get($abstract);
        $abstractAlias.forEach((alias) => {
            if (!_.isUndefined(binding = this.findInContextualBindings(alias)) && !_.isNull(binding)) {
                return binding;
            }
        });
    }
    /**
     * Find the concrete binding for the given $abstract in the contextual binding array.
     *
     * @return string|null
     * @param $abstract
     */
    findInContextualBindings($abstract) {
        let end = this._buildStack.end();
        if (!_.isUndefined(this._contextual[end]) && !_.isArray(this._contextual[end]) && !_.isUndefined(this._contextual[end][$abstract])) {
            return this._contextual[end][$abstract];
        }
        return null;
    }
    has(id) {
        return this.bound(id);
    }
    /**
     * Determine if the given $abstract type has been bound.
     *
     * @param  {string}  $abstract
     * @return boolean
     */
    bound($abstract) {
        return !_.isUndefined(this._bindings.get($abstract))
            || !_.isUndefined(this._instances.get($abstract))
            || this.isAlias($abstract);
    }
    isAlias($abstract) {
        return !_.isUndefined(this._aliases.get($abstract));
    }
    /**
     * Alias a type to a different name.
     *
     * @return void
     * @param $abstract
     * @param alias
     */
    alias($abstract, alias) {
        this._aliases.set(alias, $abstract);
        let aliases = this._$abstractAliases.get($abstract);
        aliases = aliases ? aliases : [];
        aliases.push(alias);
        this._$abstractAliases.set($abstract, aliases);
    }
    /**
     * Get the alias for an $abstract if available.
     *
     * @return string
     *
     * @throws \LogicException
     * @param $abstract
     */
    getAlias($abstract) {
        let _aliases = this._aliases.get($abstract);
        if (_.isUndefined(_aliases)) {
            return $abstract;
        }
        if (_aliases === $abstract) {
            throw `${$abstract} is aliased to itself.`;
        }
        return this.getAlias(_aliases);
    }
    /**
     * Assign a set of tags to a given binding.
     *
     * @return void
     * @param $abstracts
     * @param tags
     */
    tag($abstracts, ...tags) {
        tags.forEach((tag) => {
            if (_.isNull(this._tags.get(tag))) {
                this._tags.set(tag, []);
            }
            $abstracts = $abstracts;
            _.forEach($abstracts, ($abstract) => {
                this._tags.get(tag).push($abstract);
            });
        });
    }
    /**
     * Resolve all of the bindings for a given tag.
     *
     * @return array
     * @param tag
     */
    tagged(tag) {
        let results = [];
        let tags = this._tags.get(tag);
        if (_.isEmpty(tags)) {
            tags.forEach(($abstract) => {
                results.push(this.make($abstract));
            });
        }
        return results;
    }
    /**
     * Register a binding with the container.
     *
     * @param  {string}  $abstract
     * @param  {Closure}  concrete
     * @param  {boolean}  shared
     * @return void
     */
    bind($abstract, concrete, shared = false) {
        concrete = this.getClosure(concrete);
        let compact = { "concrete": concrete, "shared": shared };
        this._bindings.set($abstract, compact);
        if (this.resolved($abstract)) {
            this.rebound($abstract);
        }
    }
    rebound($abstract) {
        let instance = this.make($abstract);
        let callbacks = this.getReboundCallbacks($abstract);
        callbacks.forEach((callback) => {
            callback(this, instance);
        });
    }
    /**
     * Get the rebound callbacks for a given type.
     *
     * @param  {string}  $abstract
     * @return {array}
     */
    getReboundCallbacks($abstract) {
        if (_.isNull(this._reboundCallbacks.get($abstract))) {
            return this._reboundCallbacks.get($abstract);
        }
        return [];
    }
    /**
     * Bind a new callback to an abstract's rebind event.
     *
     * @param  {string}    $abstract
     * @param  {Closure}  $callback
     * @return {any}
     */
    rebinding($abstract, $callback) {
        $abstract = this.getAlias($abstract);
        let callbacks = this._reboundCallbacks.get($abstract);
        callbacks = callbacks ? callbacks : [];
        callbacks.push($callback);
        this._reboundCallbacks.set($abstract, callbacks);
        if (this.bound($abstract)) {
            return this.make($abstract);
        }
    }
    /**
     * Get the Closure to be used when building a type.
     * @param  {Closure}  $concrete
     * @return {Closure}
     */
    getClosure(concrete) {
        return () => {
            let parameters = array_1.end(this._with);
            try {
                if (!_.isArray(parameters)) {
                    parameters = [parameters];
                }
                return concrete(this, ...parameters);
            }
            catch (e) {
                return null;
            }
        };
    }
    build(concrete) {
        return concrete();
    }
    /**
     * Get the last parameter override.
     *
     * @return array
     */
    getLastParameterOverride() {
        return this._with.length > 0 ? array_1.end(this._with) : [];
    }
    dropStaleInstances($abstract) {
        this._instances.delete($abstract);
        this._aliases.delete($abstract);
    }
    /**
     * Register a binding if it hasn't already been registered.
     *
     * @return void
     * @param $abstract
     * @param concrete
     * @param shared
     */
    bindIf($abstract, concrete = null, shared = false) {
        if (!this.bound($abstract)) {
            this.bind($abstract, concrete, shared);
        }
    }
    /**
     * Register a shared binding in the container.
     *
     * @return void
     * @param $abstract
     * @param concrete
     */
    singleton($abstract, concrete = null) {
        this.bind($abstract, concrete, true);
    }
    /**
     * "Extend" an $abstract type in the container.
     *
     * @return void
     *
     * @throws \InvalidArgumentException
     * @param $abstract
     * @param closure
     */
    extend($abstract, closure) {
        $abstract = this.getAlias($abstract);
        let instance = this._instances.get($abstract);
        if (!_.isNull(instance)) {
            let stack = new Array;
            stack.push(closure(instance, this));
            this._instances.set($abstract, stack);
            this.rebound($abstract);
        }
        else {
            this._extenders.get($abstract).push(closure);
            if (this.resolved($abstract)) {
                this.rebound($abstract);
            }
        }
    }
    /**
     * Register an existing instance as shared in the container.
     *
     * @return any
     * @param $abstract
     * @param instance
     */
    instance($abstract, instance) {
        this.remove$abstractAlias($abstract);
        let isBound = this.bound($abstract);
        this._aliases.delete($abstract);
        this._instances.set($abstract, instance);
        if (isBound) {
            this.rebound($abstract);
        }
        return instance;
    }
    /**
     * Remove an alias from the contextual binding alias cache.
     *
     * @return void
     * @param searched
     */
    remove$abstractAlias(searched) {
        if (_.isEmpty(this._aliases.get(searched))) {
            return;
        }
        this._$abstractAliases.forEach((aliases, $abstract) => {
            aliases.forEach((alias, index) => {
                if (alias === searched) {
                    this._$abstractAliases.get($abstract).splice(index, 1);
                }
            });
        });
        throw new Error("Method not implemented.");
    }
    /**
     * Define a contextual binding.
     *
     * @return ContextualBindingBuilder
     * @param concrete
     */
    when(concrete) {
        return new ContextualBindingBuilder_1.default(this, this.getAlias(concrete));
    }
    /**
     * Get a closure to resolve the given type from the container.
     *
     * @return \Closure
     * @param $abstract
     */
    factory($abstract) {
        return function () {
            return this.make($abstract);
        };
    }
    /**
     * An alias function name for make().
     *
     * @return any
     * @param $abstract
     * @param parameters
     */
    makeWith($abstract, parameters = []) {
        return this.make($abstract, parameters);
    }
    /**
     * Resolve the given type from the container.
     *
     * @return any
     * @param $abstract
     * @param parameters
     */
    make($abstract, parameters = []) {
        return this.resolve($abstract, parameters);
    }
    /**
     * Call the given Closure / class@method and inject its dependencies.
     *
     * @return mixed
     * @param callback
     * @param parameters
     * @param defaultMethod
     */
    all(callback, parameters, defaultMethod) {
    }
    /**
     * Determine if the given $abstract type has been resolved.
     *
     * @return boolean
     * @param $abstract
     */
    resolved($abstract) {
        if (this.isAlias($abstract)) {
            $abstract = this.getAlias($abstract);
        }
        return _.isNull(this._resolved.get($abstract))
            || _.isNull(this._instances.get($abstract));
    }
    /**
     * Register a new resolving callback.
     *
     * @return void
     * @param $abstract
     * @param callback
     */
    resolving($abstract, callback = null) {
        if (_.isString($abstract)) {
            $abstract = this.getAlias($abstract);
        }
        if (_.isNull(callback) && _.isFunction($abstract)) {
            this._globalResolvingCallbacks.push($abstract);
        }
        else {
            let callbacks = this._resolvingCallbacks[$abstract] ?
                this._resolvingCallbacks[$abstract] : (this._resolvingCallbacks[$abstract] = []);
            callbacks.push(callback);
        }
    }
    /**
     * Register a new after resolving callback.
     *
     * @return void
     * @param $abstract
     * @param callback
     */
    afterResolving($abstract, callback) {
        if (_.isString($abstract)) {
            $abstract = this.getAlias($abstract);
        }
        if (_.isFunction($abstract) && _.isNull(callback)) {
            this._globalAfterResolvingCallbacks.push($abstract);
        }
        else {
            this._afterResolvingCallbacks[$abstract].push(callback);
        }
    }
}
/**
 * The current globally available container (if any).
 *
 * @var static instance
 */
Container.instance = null;
exports.default = Container;
