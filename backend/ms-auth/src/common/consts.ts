export class Consts {
    static JWT_SECRET = process.env.JWT_SECRET ?? 'colegio_ohiggins_secret_changeme';
    static JWT_EXPIRES_IN = 60 * 60 * 24; // 24 horas
}

export enum HTTPStatusCode {
 SUCCESS = 200,
 CREATED = 201,
 NO_CONTENT = 204,
 BAD_REQUEST = 400,
 UNAUTHORIZED = 401,
 FORBIDDEN = 403,
 NOT_FOUND = 404,
 REQUEST_TIMEOUT = 408,
 INTERNAL_SERVER_ERROR = 500,
 BAD_GATEWAY = 502,
 SERVICE_UNAVAILABLE = 503,
 GATEWAY_TIMEOUT = 504,
}
