export class InvalidEmailsError extends Error {
    constructor(public readonly invalidEmails: string[]) {
        super('Some emails do not correspond to existing users');
        this.name = 'InvalidEmailsError';
    }
}
