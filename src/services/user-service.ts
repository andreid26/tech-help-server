import { IUser } from "../types/user";
import { UserValidation } from "../validation/user-validation";

const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
export namespace UserService {

    export async function insert(user: IUser) {
        const isValidUser = UserValidation.insertValidation(user);
        if(isValidUser.valid) {
            const { username, email, password } = user;
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const request = new sql.Request();
            request.input('username', sql.NVarChar(50), username);
            request.input('email', sql.NVarChar(50), email);
            request.input('password',  sql.NVarChar(100), hashedPassword);
           
            const result = await request.execute('usp_insert_User');
            const returnValue = parseInt(result.returnValue);
            return {
                result: returnValue === -1 ? "error" : "succeeded",
                id: returnValue,
                errorMessage: returnValue === -1 ? "User already exists" : null
            }
        } else {
            return {
                result: "error",
                id: null,
                errorMessage: isValidUser.error
            }
        }
    }

    export async function get(user: IUser): Promise<{user?: IUser, errorMessage?: string}> {
        const { email, password } = user;

        const request = new sql.Request();
        request.input('email', sql.NVarChar(50), email);

        const result = await request.execute('usp_get_User');
        let responseUser = {};
        if(result.recordset.length > 0) {
            const dbPassword = result.recordset[0].password;
            const isCorrectPassword = await bcrypt.compare(password, dbPassword);

            if(isCorrectPassword) {
                const userFiltered = Object.entries(result.recordset[0]).filter(([key, value]) => key !== 'password');
                const user = Object.fromEntries(userFiltered);

                const token = jwt.sign({id: user.id, email: user.email, username: user.username}, process.env.TOKEN_KEY, {expiresIn: "2h"});

                responseUser = {
                    user,
                    token
                };

            } else {
                responseUser = {
                    errorMessage: "Incorrect password"
                };
            }

        } else {
            responseUser = {
                errorMessage: "User doesn't exist"
            };
        }

        return responseUser;
    }

    export async function getCurrentUser(id: number) {
        const request = new sql.Request();
        request.input('id', sql.Int, id);
        const result = await request.execute('usp_get_User');

        if(result.recordset.length == 1) {
            const userFiltered = Object.entries(result.recordset[0]).filter(([key, value]) => key !== 'password');
            const user  = Object.fromEntries(userFiltered);
            return user;
        }
        return;
    }

}