export class InvalidSectionsError extends Error {
    constructor(public readonly invalidSections: string[]) {
        super('Some section names do not correspond to existing sections');
        this.name = 'InvalidSectionsError';
    }
}
