export class MaxNumberOFCheckInError extends Error {
    constructor() {
        super('Max number of check in reached.');
    }
}