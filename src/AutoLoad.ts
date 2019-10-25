import {isClass} from "./Utils/Types";

export default  class AutoLoad {
    public static load(path: string) {
        let requires = require(path);
        for (let requiresKey in requires) {
            if(isClass(requires[requiresKey])) {
                requires[requiresKey].path = path;
            }
        }
        return requires;
    }
}
