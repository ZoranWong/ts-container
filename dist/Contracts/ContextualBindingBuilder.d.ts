export default interface ContextualBindingBuilder {
    /**
     * Define the abstract target that depends on the context.
     *
     * @return $this
     * @param abstract
     */
    needs(abstract: any): void;
    /**
     * Define the implementation for the contextual binding.
     *
     * @return void
     * @param implementation
     */
    give(implementation: any): void;
}
