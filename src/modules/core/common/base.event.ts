export class BaseEvent {
    constructor(init?: Partial<BaseEvent>) {
        Object.assign(this, init);
    }
}
