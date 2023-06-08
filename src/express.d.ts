import { Response } from "express";

interface UserLocal {
    _id? : number,
    firstName? : string,
    lastName? : string,
    email? : string
}

declare module 'express' {
    interface Response {
        locals: UserLocal;
    }
}