export default interface ContextualBindingBuilder {
    /**
     * Define the abstract target that depends on the context.
     *
     * @param  string  $abstract
     * @return $this
     */
    needs(abstract: string);

    /**
     * Define the implementation for the contextual binding.
     *
     * @param  \Closure|string  $implementation
     * @return void
     */
    give(implementation: any);
}
