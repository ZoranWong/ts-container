"use strict";
import ContainerContract from './Contracts/Container';
import { Closure, isClass, isClosure } from './Utils/Types';
import ContextualBindingBuilder from './ContextualBindingBuilder';
import * as _ from 'lodash';
import Binding from './Contracts/Binding';
import Stack from "./Contracts/Stack";
import { end } from "./Utils/array";
import StrKeyMap from "./StrKeyMap";
import ReflectClass from "./ReflectClass";
import BindingResolutionException from "./Expceptions/BindingResolutionException";
import Ctor from "./Contracts/Ctor";
import * as md5 from "md5";
import { Namespace, NamespaceMap } from "./Contracts/Namespace";
import AutoLoad from "./AutoLoad";

export default class Container implements ContainerContract {
    /**
     * The current globally available container (if any).
     *
     * @var static instance
     */
    protected static instance: any = null;

    /**
     * An array of the types that have been resolved.
     *
     * @var Map<string, any> _resolved
     */
    protected _resolved: StrKeyMap<any> = new StrKeyMap<any>();

    /**
     * The container's bindings.
     *
     * @var array
     */
    protected _bindings: StrKeyMap<Binding> = new StrKeyMap<Binding>();

    /**
     * The container's method bindings.
     *
     * @var array
     */
    protected _methodBindings: StrKeyMap<Closure> = new StrKeyMap<Closure>();

    /**
     * The container's shared instances.
     *
     * @var array
     */
    protected _instances: StrKeyMap<any> = new StrKeyMap<any>();

    /**
     * The registered type aliases.
     *
     * @var array
     */
    protected _aliases: StrKeyMap<any> = new StrKeyMap<any>();

    /**
     * The registered aliases keyed by the $abstract name.
     *
     * @var array
     */
    protected _$abstractAliases: StrKeyMap<Array<string>> = new StrKeyMap<Array<string>>();

    /**
     * The extension closures for services.
     *
     * @var array
     */
    protected _extenders: StrKeyMap<Array<any>> = new StrKeyMap<Array<any>>();

    /**
     * All of the registered tags.
     *
     * @var array
     */
    protected _tags: StrKeyMap<Array<any>> = new StrKeyMap<Array<any>>();

    /**
     * The stack of concretions currently being built.
     *
     * @var array
     */
    protected _buildStack: Stack = new Stack();

    /**
     * The parameter override stack.
     *
     * @var array
     */
    protected _with: any[] = [];


    /**
     * The contextual binding map.
     *
     * @var array
     */
    public _contextual: any[] = [];

    /**
     * All of the registered rebound callbacks.
     *
     * @var array
     */
    protected _reboundCallbacks: StrKeyMap<Array<Closure>> = new StrKeyMap<Array<Closure>>();

    /**
     * All of the global resolving callbacks.
     *
     * @var array
     */
    protected _globalResolvingCallbacks: StrKeyMap<any> = new StrKeyMap<any>();

    /**
     * All of the global after resolving callbacks.
     *
     * @var array
     */
    protected _globalAfterResolvingCallbacks: StrKeyMap<any> = new StrKeyMap<any>();

    /**
     * All of the resolving callbacks by class type.
     *
     * @var array
     */
    protected _resolvingCallbacks: StrKeyMap<any> = new StrKeyMap<any>();

    /**
     * All of the after resolving callbacks by class type.
     *
     * @var array
     */
    protected _afterResolvingCallbacks: StrKeyMap<any> = new StrKeyMap<any>();

    protected _namespaceMap: NamespaceMap = new NamespaceMap();

    constructor(rootPath: string = '', autoLoadNamespaces: Array<Namespace> = []) {
        this.setRootPath(rootPath);
        this.setNamespaces(autoLoadNamespaces);
    }

    public setRootPath(rootPath: string) {
        this._namespaceMap.rootPath(rootPath);
        return this;
    }

    public setNamespaces(autoLoadNamespaces: Array<Namespace>) {
        this._namespaceMap.namespaces(autoLoadNamespaces);
        return this;
    }

    public get(id: any): any {
        if(isClass(id)) {
            id = id.namespace;
        }
        if (this.has(id)) {
            return this.resolve(id);
        } else {
            return this.autoLoadResolve(id);
        }
    }


    protected namespaceResolve(namespace: string) {
       return this._namespaceMap.namespaceResolve(namespace);
    }

    protected autoLoadResolve(namespace: string) {
        namespace = this.getAlias(namespace);
        let path = this.namespaceResolve(namespace);
        AutoLoad.load(path);
        return this.resolve(namespace);
    }

    protected resolve($abstract: any, parameters: Array<any> = [], raiseEvents: boolean = true): any {
        $abstract = this.getAlias($abstract);

        let needsContextualBuild = (parameters.length > 0 || !_.isEmpty(
            this.getContextualConcrete($abstract)
        ));
        if (!_.isEmpty(this._instances.get($abstract)) && !needsContextualBuild) {
            return this._instances.get($abstract);
        }

        this._with.push(parameters);

        let concrete = this.getConcrete($abstract);
        let object: any = null;
        if (this.isBuildable(concrete, $abstract)) {
            object = this.build(concrete);
        } else {
            object = this.make(concrete);
        }

        let extenders = this.getExtenders($abstract) ? this.getExtenders($abstract) : [];
        extenders.forEach(($extender: Closure) => {
            object = $extender(object, this);
        });

        if (this.isShared($abstract) && !needsContextualBuild) {
            this._instances.set($abstract, object);
        }

        if (raiseEvents) {
            this.fireResolvingCallbacks($abstract, object);
        }

        this._resolved.set($abstract, true);
        this._with.pop();
        return object;
    }

    protected isBuildable($concrete: any, $abstract: any) {
        return $concrete === $abstract || isClosure($concrete);
    }

    /**
     * add contextual binding
     * @return void
     * @param $concrete
     * @param $abstract
     * @param $implementation
     * */
    public addContextualBinding($concrete: any, $abstract: any, $implementation: any): void {
        this._contextual[$concrete] = this._contextual[$concrete] ? this._contextual[$concrete] : [];
        this._contextual[$concrete][this.getAlias($abstract)] = $implementation;
    }

    /**
     * Determine if the container has a method binding.
     *
     * @return boolean
     * @param method
     */
    public hasMethodBinding(method: string): boolean {
        return !_.isNull(this._methodBindings.get(method));
    }

    /**
     * Get the method binding for the given method.
     *
     * @return any
     * @param method
     * @param instance
     */
    public callMethodBinding(method: string, instance: any): any {
        return this._methodBindings.get(method).apply(instance, this);
    }

    /**
     * Fire all of the resolving callbacks.
     *
     * @return void
     * @param $abstract
     * @param object
     */
    protected fireResolvingCallbacks($abstract: string, object: any) {
        this.fireCallbackArray(object, this._globalResolvingCallbacks);
        this.fireCallbackArray(
            object, this.getCallbacksForType($abstract, object, this._resolvingCallbacks)
        );

        this.fireAfterResolvingCallbacks($abstract, object);
    }

    protected fireAfterResolvingCallbacks($abstract: string, object: any): any {
        this.fireCallbackArray(object, this._globalAfterResolvingCallbacks);

        this.fireCallbackArray(
            object, this.getCallbacksForType($abstract, object, this._afterResolvingCallbacks)
        );
    }

    protected getCallbacksForType($abstract: string, object: any, callbacksForType: StrKeyMap<any>): Array<any> {
        let results: any = [];
        callbacksForType.forEach((callbacks: any, type: any) => {
            if (type === $abstract) {
                results = results.concat(callbacks);
            }
        });
        return results;
    }

    protected fireCallbackArray(object: any, callbacks: Array<any> | StrKeyMap<any>) {
        callbacks.forEach((callback: any) => {
            callback instanceof Function && (callback = [callback]);
            callback.forEach((fn: Closure) => {
                fn(object, this);
            });
        });
    }

    protected isShared($abstract: string): boolean {
        let binding: Binding = this._bindings.get($abstract);
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
    protected getExtenders($abstract: string): Array<any> {
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
    protected getConcrete($abstract: string): any {
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
    protected getContextualConcrete($abstract: string): any {
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
    protected findInContextualBindings($abstract: string): any {
        let end = this._buildStack.end();
        if (!_.isUndefined(this._contextual[end]) && !_.isArray(this._contextual[end]) && !_.isUndefined(this._contextual[end][$abstract])) {
            return this._contextual[end][$abstract];
        }
        return null;
    }

    public has(id: any): boolean {
        return this.bound(id);
    }

    /**
     * Determine if the given $abstract type has been bound.
     *
     * @param  {string}  $abstract
     * @return boolean
     */
    public bound($abstract: string): boolean {
        return !_.isUndefined(this._bindings.get($abstract))
            || !_.isUndefined(this._instances.get($abstract))
            || this.isAlias($abstract);
    }

    public isAlias($abstract: string): boolean {
        return !_.isUndefined(this._aliases.get($abstract));
    }

    /**
     * Alias a type to a different name.
     *
     * @return void
     * @param $abstract
     * @param alias
     */
    public alias($abstract: string, alias: string) {
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
    public getAlias($abstract: string): string {
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
    public tag($abstracts: any, ...tags: Array<any>) {
        tags.forEach((tag) => {
            if (_.isNull(this._tags.get(tag))) {
                this._tags.set(tag, []);
            }
            $abstracts = $abstracts as Array<any>;
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
    public tagged(tag: string): Array<any> {
        let results: any[] = [];
        let tags = this._tags.get(tag);
        if (_.isEmpty(tags)) {
            tags.forEach(($abstract: any) => {
                results.push(this.make($abstract));
            });
        }
        return results;
    }

    /**
     * Register a binding with the container.
     *
     * @param  {string}  $abstract
     * @param  {Closure|string}  concrete
     * @param  {boolean}  shared
     * @return void
     */
    public bind($abstract: any, concrete: Closure | string, shared: boolean = false) {
        if ($abstract === concrete) {
            $abstract = md5($abstract.toString());
        }
        concrete = this.getClosure(concrete);
        let compact: Binding = { "concrete": concrete, "shared": shared };
        this._bindings.set($abstract, compact);
        if (this.resolved($abstract)) {
            this.rebound($abstract);
        }
    }

    protected rebound($abstract: any): any {
        let instance = this.make($abstract);
        let callbacks = this.getReboundCallbacks($abstract);
        callbacks.forEach((callback: Closure) => {
            callback(this, instance);
        });
    }

    /**
     * Get the rebound callbacks for a given type.
     *
     * @param  {string}  $abstract
     * @return {array}
     */
    protected getReboundCallbacks($abstract: any): Array<any> {
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
    public rebinding($abstract: any, $callback: Closure): any {
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
    protected getClosure(concrete: any): Closure {
        if (isClass(concrete)) {
            return () => {
                let parameters: Array<any> = end(this._with);
                return this.createInstance(concrete, parameters);
            };
        } else {
            return concrete;
        }
    }

    /**
     * 创建实例
     * @param {Ctor<T>} _constructor
     * @param {Array<any>} args
     * @return Function
     * */
    protected createInstance(_constructor: any, args: Array<any>) {
        let reflectClass = new ReflectClass(_constructor);
        let params = reflectClass.getParameters();
        let paramInstances: Array<any> = [];
        params.forEach((v, k) => {
            if (typeof args[k] !== 'undefined') {
                paramInstances.push(args[k]);
            } else {
                paramInstances.push(v);
            }
        });
        return new _constructor(...paramInstances);
    }

    public build(concrete: any): any {
        if (isClosure(concrete)) {
            return concrete.apply(this, this.getLastParameterOverride())
        }

        let reflector = new ReflectClass(concrete);
        if (!reflector.isInstantiable()) {
            return this.notInstantiable(concrete);
        }
        this._buildStack.push(concrete);
        let constructor: Ctor<any> = reflector.getConstructor();
        if (_.isNull(constructor)) {
            this._buildStack.pop();
            return new concrete();
        }
        this._buildStack.pop();
        return this.createInstance(constructor, end(this._with));
    }

    /**
     * @param concrete
     * @throws
     * */
    protected notInstantiable(concrete: any): void {
        let message = '';
        if (!_.isEmpty(this._buildStack)) {
            let previous: String = this._buildStack.join(',');
            message = `Target [${concrete}] is not instantiable while building [${previous}].`;
        } else {
            message = `Target [${concrete}] is not instantiable.`;
        }
        throw new BindingResolutionException(message);
    }

    /**
     * Get the last parameter override.
     *
     * @return array
     */
    protected getLastParameterOverride(): Array<any> {
        return this._with.length > 0 ? end(this._with) : [];
    }

    protected dropStaleInstances($abstract: string) {
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
    public bindIf($abstract: string, concrete: any = null, shared: boolean = false) {
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
    public singleton($abstract: any, concrete: any = null) {
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
    public extend($abstract: string, closure: Closure) {
        $abstract = this.getAlias($abstract);
        let instance = this._instances.get($abstract);
        if (!_.isNull(instance)) {
            let stack = new Array;
            stack.push(closure(instance, this));
            this._instances.set($abstract, stack);
            this.rebound($abstract);
        } else {
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
    public instance($abstract: string, instance: any): any {
        this.removeAbstractAlias($abstract);
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
    protected removeAbstractAlias(searched: string) {
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
    public when(concrete: string): ContextualBindingBuilder {
        return new ContextualBindingBuilder(this, this.getAlias(concrete));
    }

    /**
     * Get a closure to resolve the given type from the container.
     *
     * @return \Closure
     * @param $abstract
     */
    public factory($abstract: string): Closure {
        return function() {
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
    public makeWith($abstract: any, parameters: any[] = []): any {
        return this.make($abstract, parameters);
    }

    /**
     * Resolve the given type from the container.
     *
     * @return any
     * @param $abstract
     * @param parameters
     */
    public make($abstract: any, parameters: Array<any> = []): any {
        if (!_.isString($abstract)) {
            $abstract = md5($abstract.toString());
        }
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
    public all(callback: any, parameters: Array<any>, defaultMethod: string) {

    }

    /**
     * Determine if the given $abstract type has been resolved.
     *
     * @return boolean
     * @param $abstract
     */
    public resolved($abstract: any): boolean {
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
    public resolving($abstract: any, callback: any = null) {
        if (_.isString($abstract)) {
            $abstract = this.getAlias($abstract);
        }
        if (_.isNull(callback) && _.isFunction($abstract)) {
            this._globalResolvingCallbacks.set($abstract.toString(), $abstract);
        } else {
            let callbacks: Array<Closure> = this._resolvingCallbacks.get($abstract) ?
                this._resolvingCallbacks.get($abstract) : (this._resolvingCallbacks.set($abstract, []).get($abstract));
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
    public afterResolving($abstract: any, callback: any) {
        if (_.isString($abstract)) {
            $abstract = this.getAlias($abstract);
        }
        if (_.isFunction($abstract) && _.isNull(callback)) {
            this._globalAfterResolvingCallbacks.set($abstract.toString(), $abstract);
        } else {
            let callbacks = this._afterResolvingCallbacks.get($abstract);
            callbacks = callbacks ? callbacks : [];
            callbacks.push(callback);
            this._afterResolvingCallbacks.set($abstract, callbacks);
        }
    }
}
