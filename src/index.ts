import {register, singleton, factory} from "./IOC";

@singleton('IOC')
class IOC {
    version: String = '0.0.1';
}

export default {register, singleton, factory};
