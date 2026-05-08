export class Consts {
    static JWT_SECRET = process.env.JWT_SECRET ?? 'colegio_ohiggins_secret_changeme';
    static JWT_EXPIRES_IN = 60 * 60 * 24; // 24 horas
}