import Express from "express";
import morgan from "morgan";
import database from "./database";

import users from "../controllers/users.controller";


import User from "../models/user.model";

export default async function configure(app : Express.Application){

    try{
        // Add middlewares
        app.use( morgan("combined") );
        app.use( Express.json() );
        app.use( Express.urlencoded({extended: true}) );
        console.log("[*] Middlewares configured...");
    
        // Init the Database
        await database.initialize();
        console.log("[*] Connected to the database...");

        // Init the admin user
        if( (await User.initAdminUser()) ) console.log("[*] Admin user not exists, created it...")

        // Mount all controllers routes
        app.use("/users", users);

        // Return true if success
        return true;
    }
    catch(e:any){
        // Show error and return false
        console.error( "[X] " + e.message );
        throw e;
    }

}