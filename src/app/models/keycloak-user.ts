export interface KeycloakUser {
    sub: string;
    email_verified: Boolean;
    name: string;
    email: string
    preferred_username: string
    given_name?: string
    family_name?: string
}