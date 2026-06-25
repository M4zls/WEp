type Parsed = {
    error: {
        issues: { message: string }[]
    }
}

export class ErrorBuilder {
    static getEntity(message: any) {
        return { error: message }
    }
    //  .
    static getEntityFromErrorParsed(parsed: Parsed) {
       return parsed.error.issues.map(i => i.message).join(', ');
    }
}