import { IUser } from "../types/user";

export namespace UserValidation {
    export function insertValidation(user: IUser): {valid: boolean, error?:string}{
        const userProps = ['username', 'email', 'password'];
        const userHasAllProps = userProps.reduce((hasAllPastKeys, key) => hasAllPastKeys && user.hasOwnProperty(key), true);
        const userPropsCorrectDataTypes = userProps.reduce((correctPastDataTypes, key) => correctPastDataTypes && (typeof user[key] === 'string'), true);

        if(!userHasAllProps || !userPropsCorrectDataTypes) return {valid: false, error: 'Missing properties / invalid data types'};

        return { valid: true };
    }
}