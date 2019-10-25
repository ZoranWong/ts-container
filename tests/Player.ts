import {register, namespace} from "../src";
@register('player')
@namespace('Test')
export default class Player {
    constructor(format = 'pm3'){}
}
