import type { ZodError } from 'zod';

export function formatZodErrors(error: ZodError): string {
  return error.issues.map(i => i.message).join(', ');
}

export class ErrorBuilder {
    static getEntity(message: any) {
        return { error: message }
    }
}
