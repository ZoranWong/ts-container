import StrKeyMap from "../StrKeyMap";
export interface Namespace {
    dir: string;
    namespace: string;
}
export declare class NamespaceMap {
    protected _rootPath: string;
    protected _namespaces: StrKeyMap<string>;
    constructor(rootPath?: string, autoLoadNamespaceConfig?: Array<Namespace>);
    rootPath(path?: string): string;
    path(path?: string): string;
    namespaces(autoLoadNamespaceConfig?: Array<Namespace>): StrKeyMap<string>;
    namespaceResolve(namespace: string): string;
}
