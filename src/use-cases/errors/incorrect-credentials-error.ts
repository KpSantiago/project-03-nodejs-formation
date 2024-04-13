export class IncorrectCredentialsError extends Error {
    constructor() {
        super('Incorrect credentials.');
    }
}