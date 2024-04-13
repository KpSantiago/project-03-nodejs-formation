export class LateCheckInValidationError extends Error {
    constructor() {
        super('Check-in only can be validated until 20 minutos of its creation.');
    }
}