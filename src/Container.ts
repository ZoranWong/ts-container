import ContainerContract from './Contracts/Container';
import { Closure } from './Utils/Types';
import ContextualBindingBuilder from './ContextualBindingBuilder';
import * as _ from 'lodash';
import Map from './Contracts/Map';
import Binding from './Contracts/Binding';
import Stack from "./Contracts/Stack";

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
    protected _resolved: Map<string, any> = new Map<string, any>();

    /**
     * The container's bindings.
     *
     * @var array
     */
    protected _bindings: Map<string, Binding> = new Map<string, Binding>();

    /**
     * The container's method bindings.
     *
     * @var array
     */
    protected _methodBindings: Map<string, Closure> = new Map<string, Closure>();

    /**
     * The container's shared instances.
     *
     * @var array
     */
    protected _instances: Map<string, any> = new Map<string, any>();

    /**
     * The registered type aliases.
     *
     * @var array
     */
    protected _aliases: Map<string, any> = new Map<string, any>();

    /**
     * The registered aliases keyed by the $abstract name.
     *
     * @var array
     */
    protected _$abstractAliases: Map<string, Array<string>> = new Map<string, Array<string>>();

    /**
     * The extension closures for services.
     *
     * @var array
     */
    protected _extenders: Map<string, Array<any>> = new Map<string, Array<any>>();

    /**
     * All of the registered tags.
     *
     * @var array
     */
    protected _tags: Map<string, Array<any>> = new Map<string, Array<any>>();

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
    protected _reboundCallbacks: Map<string, Closure> = new Map<string, Closure>();

    /**
     * All of the global resolving callbacks.
     *
     * @var array
     */
    protected _globalResolvingCallbacks: Array<any> = [];

    /**
     * All of the global after resolving callbacks.
     *
     * @var array
     */
    protected _globalAfterResolvingCallbacks: Array<any> = [];

    /**
     * All of the resolving callbacks by class type.
     *
     * @var array
     */
    protected _resolvingCallbacks: Array<any> = [];

    /**
     * All of the after resolving callbacks by class type.
     *
     * @var array
     */
    protected _afterResolvingCallbacks: Array<any> = [];

    constructor() {

    }

    call(callback: any, parameters: any[], defaultMethod: string) {
        throw new Error("Method not implemented.");
    }

    public get(id: any): any {
        if (this.has(id)) {
            return this.resolve(id);
        }
        throw 'EntryNotFoundException';
    }

    protected resolve($abstract: string, parameters: Array<any> = []): any {
        $abstract = this.getAlias($abstract);
        let needsContextualBuild = !(parameters.length > 0 && _.isNull(
            this.getContextualConcrete($abstract)
        ));
        if (!isNaN(this._instances.get($abstract)) && !needsContextualBuild) {
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

        this.getExtenders($abstract).forEach( ($extender: Closure) => {
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

    /**
    * Determine if the container has a method binding.
    *
    * @param  string  $method
    * @return boolean
    */
    public hasMethodBinding(method: string): boolean {
        return !_.isNull(this._methodBindings.get(method));
    }

    /**
     * Get the method binding for the given method.
     *
     * @param  string  method
     * @param  any  instance
     * @return any
     */
    public callMethodBinding(method: string, instance: any): any {
        return this._methodBindings.get(method).apply(instance, this);
    }

    /**
    * Fire all of the resolving callbacks.
    *
    * @param  string  $abstract
    * @param  any   object
    * @return void
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

    protected getCallbacksForType($abstract: string, object: any, callbacksForType: Array<any>): Array<any> {
        let results: any = [];
        callbacksForType.forEach( (callbacks: any, type: any) => {
            if (type === $abstract || object instanceof type) {
                results = results.concat(callbacks);
            }
        });
        return results;
    }

    protected fireCallbackArray(object: any, callbacks: Array<any>) {
        callbacks.forEach( (callback: any) => {
            callback instanceof Function && (callback = [callback]);
            callback.forEach((fn: Closure) => {
                fn(object, this);
            });
        });
    }

    protected isShared($abstract: string): boolean {
        return !_.isNull(this._instances.get($abstract)) ||
            (!_.isNull(this._bindings.get($abstract).concrete) &&
                this._bindings.get($abstract).shared === true);
    }

    /**
    * Get the extender callbacks for a given type.
    *
    * @param  string  $$abstract
    * @return array
    */
    protected getExtenders($abstract: string): Array<any> {
        $abstract = this.getAlias($abstract);
        if (!this._extenders.get($abstract)) {
            return this._extenders.get($abstract);
        }
        return [];
    }

    /**
    * Determine if the given concrete is buildable.
    *
    * @param  mixed   concrete
    * @param  string  $abstract
    * @return boolean
    */
    protected isBuildable(concrete: any, $abstract: string): boolean {
        return concrete === $abstract || _.isFunction(concrete);
    }

    /**
    * Get the concrete type for a given $abstract.
    *
    * @param  string  $abstract
    * @return mixed   concrete
    */
    protected getConcrete($abstract: string): any {
        let concrete = null;
        if (!_.isNull(concrete = this.getContextualConcrete($abstract))) {
            return concrete;
        }

        if (!_.isNull(this._bindings.get($abstract))) {
            return this._bindings.get($abstract).concrete;
        }
        return $abstract;
    }

    /**
    * Get the contextual concrete binding for the given $abstract.
    *
    * @param  string  $abstract
    * @return string|null
    */
    protected getContextualConcrete($abstract: string): any {
        let binding = null;
        if (!_.isNull(binding = this.findInContextualBindings($abstract))) {
            return binding;
        }

        // Next we need to see if a contextual binding might be bound under an alias of the
        // given $abstract type. So, we will need to check if any aliases exist with this
        // type and then spin through them and check for contextual bindings on these.
        if (_.isEmpty(this._$abstractAliases.get($abstract))) {
            return;
        }
        let $abstractAlias = this._$abstractAliases.get($abstract);
        $abstractAlias.forEach((alias) => {
            if (!_.isNull(binding = this.findInContextualBindings(alias))) {
                return binding;
            }
        });
    }

    /**
    * Find the concrete binding for the given $abstract in the contextual binding array.
    *
    * @param  string  $abstract
    * @return string|null
    */
    protected findInContextualBindings($abstract: string): any {
        let end = this._buildStack.end();
        if (!_.isNull(this._contextual[end][$abstract])) {
            return this._contextual[end][$abstract];
        }
    }

    public has(id: any): boolean {
        return this.bound(id);
    }

    /**
     * Determine if the given $abstract type has been bound.
     *
     * @param  any  $abstract
     * @return boolean
     */
    public bound($abstract: any): boolean {
        return _.isNull(this._bindings.get($abstract))
            || _.isNull(this._instances.get($abstract))
            || this.isAlias($abstract);
    }

    public isAlias($abstract: string): boolean {
        return _.isNull(this._aliases.get($abstract));
    }

    /**
     * Alias a type to a different name.
     *
     * @param  string  $abstract
     * @param  string  alias
     * @return void
     */
    public alias($abstract: string, alias: string) {
        this._aliases.set(alias, $abstract);
        this._$abstractAliases.get($abstract).push(alias);
    }

    /**
     * Get the alias for an $abstract if available.
     *
     * @param  string  $$abstract
     * @return string
     *
     * @throws \LogicException
     */
    public getAlias($abstract: string): string {
        let _aliases = this._aliases.get($abstract);
        if (_.isNull(_aliases)) {
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
     * @param  array|string  $abstracts
     * @param  array|any   ...tags
     * @return void
     */
    public tag($abstracts: any, ...tags: Array<any>) {
        tags.forEach((tag) => {
            if (_.isNull(this._tags.get(tag))) {
                this._tags.set(tag,  []);
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
     * @param  string  tag
     * @return array
     */
    public tagged(tag: string): Array<any> {
        let results: any[] = [];
        let tags = this._tags.get(tag);
        if (_.isEmpty(tags)) {
            tags.forEach( ($abstract: any) => {
                results.push(this.make($abstract));
            });
        }
        return results;
    }

    /**
     * Register a binding with the container.
     *
     * @param  string  $abstract
     * @param  Closure|string|null  concrete
     * @param  boolean  shared
     * @return void
     */
    public bind($abstract: string, concrete: any = null, shared: boolean = false) {
        if (concrete === null) {
            concrete = $abstract;
        }
        if (_.isFunction(concrete)) {
            concrete = this.getClosure($abstract, concrete);
        }
        let compact : Binding = { "concrete": concrete, "shared": shared };
        this._bindings.set($abstract, compact);
        if (this.resolved($abstract)) {
            this.rebound($abstract);
        }
    }

    protected rebound($abstract: string): any {
        throw new Error("Method not implemented.");
    }

    /**
    * Get the Closure to be used when building a type.
    *
    * @param  string  $$abstract
    * @param  any  $concrete
    * @return \Closure
    */
    protected getClosure($abstract: string, concrete: any): Closure {
        return function(container: Container, parameters: any[] = []) {
            if ($abstract == concrete) {
                return container.build(concrete);
            }
            return container.make(concrete, parameters);
        };
    }

    build(concrete: string): any {
        throw new Error("Method not implemented.");
    }

    protected dropStaleInstances($abstract: string) {
        this._instances.delete($abstract);
        this._aliases.delete($abstract);
    }

    /**
     * Register a binding if it hasn't already been registered.
     *
     * @param  string  $abstract
     * @param  \Closure|string|null  concrete
     * @param  boolean  shared
     * @return void
     */
    public bindIf($abstract: string, concrete: any = null, shared: boolean = false) {
        if (!this.bound($abstract)) {
            this.bind($abstract, concrete, shared);
        }
    }

    /**
     * Register a shared binding in the container.
     *
     * @param  string  $abstract
     * @param  Closure|string|null  concrete
     * @return void
     */
    public singleton($abstract: string, concrete: any = null) {
        this.bind($abstract, concrete, true);
    }

    /**
     * "Extend" an $abstract type in the container.
     *
     * @param  string    $abstract
     * @param  Closure  closure
     * @return void
     *
     * @throws \InvalidArgumentException
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
     * @param  string  $abstract
     * @param  any   instance
     * @return any
     */
    public instance($abstract: string, instance: any): any {
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
     * @param  string  $searched
     * @return void
     */
    protected remove$abstractAlias(searched: string) {
        if (_.isEmpty(this._aliases.get(searched))) {
            return;
        }
        this._$abstractAliases.forEach( (aliases, $abstract) => {
            aliases.forEach( (alias, index) => {
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
     * @param  string  $concrete
     * @return ContextualBindingBuilder
     */
    public when(concrete: string): ContextualBindingBuilder {
        return new ContextualBindingBuilder(this, this.getAlias(concrete));
    }

    /**
     * Get a closure to resolve the given type from the container.
     *
     * @param  string  $$abstract
     * @return \Closure
     */
    public factory($abstract: string): Closure {
        return function() {
            return this.make($abstract);
        };
    }

    /**
        * An alias function name for make().
        *
        * @param  string  $$abstract
        * @param  array  $parameters
        * @return any
        */
    public makeWith($abstract: string, parameters: any[] = []): any {
        return this.make($abstract, parameters);
    }

    /**
     * Resolve the given type from the container.
     *
     * @param  string  $abstract
     * @param  Array<any>  parameters
     * @return any
     */
    public make($abstract: string, parameters: Array<any> = []): any {
        return this.resolve($abstract, parameters);
    }

    /**
     * Call the given Closure / class@method and inject its dependencies.
     *
     * @param  callable|string  callback
     * @param  array  parameters
     * @param  string|null  defaultMethod
     * @return mixed
     */
    public all(callback: any, parameters: Array<any>, defaultMethod: string) {

    }

    /**
     * Determine if the given $abstract type has been resolved.
     *
     * @param  string $abstract
     * @return boolean
     */
    public resolved($abstract: string): boolean {
        if (this.isAlias($abstract)) {
            $abstract = this.getAlias($abstract);
        }
        return _.isNull(this._resolved.get($abstract))
            || _.isNull(this._instances.get($abstract));
    }

    /**
     * Register a new resolving callback.
     *
     * @param  \Closure|string  $abstract
     * @param  \Closure|null  callback
     * @return void
     */
    public resolving($abstract: any, callback: any = null) {
        if (_.isString($abstract)) {
            $abstract = this.getAlias($abstract);
        }

        if (_.isNull(callback) && _.isFunction($abstract)) {
            this._globalResolvingCallbacks.push($abstract);
        } else {
            let callbacks: Array<Closure> = this._resolvingCallbacks[$abstract] ?
                this._resolvingCallbacks[$abstract] : (this._resolvingCallbacks[$abstract] = []);
            callbacks.push(callback);
        }
    }

    /**
     * Register a new after resolving callback.
     *
     * @param  \Closure|string  $abstract
     * @param  \Closure|null  callback
     * @return void
     */
    public afterResolving($abstract: any, callback: any) {
        if (_.isString($abstract)) {
            $abstract = this.getAlias($abstract);
        }
        if (_.isFunction($abstract) && _.isNull(callback)) {
            this._globalAfterResolvingCallbacks.push($abstract);
        } else {
            this._afterResolvingCallbacks[$abstract].push(callback);
        }
    }
}
