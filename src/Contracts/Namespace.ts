"use strict";
import StrKeyMap from "../StrKeyMap";
import * as _ from 'lodash';
export interface Namespace {
    dir: string;
    namespace: string;
};

export class NamespaceMap {
    protected _rootPath: string = '';
    protected _namespaces: StrKeyMap<string> = new StrKeyMap<string>();

    public constructor (rootPath?: string, autoLoadNamespaceConfig?: Array<Namespace>) {
        if (autoLoadNamespaceConfig)
            autoLoadNamespaceConfig.map((value) => {
                this._namespaces.set(value.namespace, value.dir.replace('/^\//', ''));
            });
        if (rootPath)
            this._rootPath = rootPath.replace('/\/$/', '');
    }

    public rootPath (path?: string) {
        if (path) {
            this._rootPath = path.replace('/\/$/', '');
        }
        return this._rootPath;
    }

    public path(path: string = "") {
        return this._rootPath + "/" + _.trim(path, '/');
    }

    public namespaces (autoLoadNamespaceConfig?: Array<Namespace>) {
        if (autoLoadNamespaceConfig)
            autoLoadNamespaceConfig.map((value) => {
                this._namespaces.set(value.namespace, value.dir.replace('/^\//', ''));
            });
        return this._namespaces;
    }

    public namespaceResolve(namespace: string) {
        let path: string = namespace;
        this._namespaces.forEach( (dir, ns) => {
            if(namespace.startsWith(`${ns}/`)) {
                path =  this.path(namespace.replace(`${ns}/`, `${dir}/`));
            }
        });
        return path;
    }
}
