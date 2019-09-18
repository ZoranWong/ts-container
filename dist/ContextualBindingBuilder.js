"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ContextualBindingBuilder {
    /**
     * Create a new contextual binding builder.
     *
     * @param  \Illuminate\Container\Container  $container
     * @param  string  $concrete
     * @return void
     */
    constructor(container, concrete) {
        this.concrete = concrete;
        this.container = container;
    }
    /**
     * Define the abstract target that depends on the context.
     *
     * @param  string  $abstract
     * @return $this
     */
    needs(abstract) {
        this.need = abstract;
        return this;
    }
    /**
     * Define the implementation for the contextual binding.
     *
     * @param  \Closure|string  implementation
     * @return void
     */
    give(implementation) {
        this.container.addContextualBinding(this.concrete, this.need, implementation);
    }
}
exports.default = ContextualBindingBuilder;
