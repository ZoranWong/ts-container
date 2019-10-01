"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ContextualBindingBuilder {
    /**
     * Create a new contextual binding builder.
     *
     * @return void
     * @param container
     * @param concrete
     */
    constructor(container, concrete) {
        this.concrete = concrete;
        this.container = container;
    }
    /**
     * Define the abstract target that depends on the context.
     *
     * @return $this
     * @param abstract
     */
    needs(abstract) {
        this.need = abstract;
        return this;
    }
    /**
     * Define the implementation for the contextual binding.
     *
     * @return void
     * @param implementation
     */
    give(implementation) {
        this.container.addContextualBinding(this.concrete, this.need, implementation);
    }
}
exports.default = ContextualBindingBuilder;
