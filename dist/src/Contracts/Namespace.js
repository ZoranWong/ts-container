"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StrKeyMap_1 = require("../StrKeyMap");
const _ = require("lodash");
;
class NamespaceMap {
    constructor(rootPath, autoLoadNamespaceConfig) {
        this._rootPath = '';
        this._namespaces = new StrKeyMap_1.default();
        if (autoLoadNamespaceConfig)
            autoLoadNamespaceConfig.map((value) => {
                this._namespaces.set(value.namespace, value.dir.replace('/^\//', ''));
            });
        if (rootPath)
            this._rootPath = rootPath.replace('/\/$/', '');
    }
    rootPath(path) {
        if (path) {
            this._rootPath = path.replace('/\/$/', '');
        }
        return this._rootPath;
    }
    path(path = "") {
        return this._rootPath + "/" + _.trim(path, '/');
    }
    namespaces(autoLoadNamespaceConfig) {
        if (autoLoadNamespaceConfig)
            autoLoadNamespaceConfig.map((value) => {
                this._namespaces.set(value.namespace, value.dir.replace('/^\//', ''));
            });
        return this._namespaces;
    }
    namespaceResolve(namespace) {
        let path = namespace;
        this._namespaces.forEach((dir, ns) => {
            if (namespace.startsWith(`${ns}/`)) {
                path = this.path(namespace.replace(`${ns}/`, `${dir}/`));
            }
        });
        return path;
    }
}
exports.NamespaceMap = NamespaceMap;
