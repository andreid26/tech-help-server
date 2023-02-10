export interface IUser {
    id?: number;
    email: string;
    username?: string;
    password: string;
    error?:string;
    isAdministrator?: boolean;
}