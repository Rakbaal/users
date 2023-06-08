import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "config";

@Entity()
export default class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    _id? : number

    @Column()
    firstName? : string

    @Column()
    lastName? : string

    @Column({unique: true})
    email? : string

    @Column({nullable: false})
    password? : string

    /**
     * Generate valid token for the user
     */
    public static generateToken(payload : any) : string {
        return jwt.sign(payload, config.get<string>("auth.secret"), {expiresIn: "1h"});
    }

    /**
     * Validate the given token 
     */
    public static verifyToken(token : string) : boolean {
        try{
            const decoded = jwt.verify(token.replace("Bearer ",""), config.get<string>("auth.secret"))
            return true;
        }
        catch(e:any){
            console.log(e.message)
            return false;
        }
    }

    public static async initAdminUser(adminLogin : string = "admin@forum.ltd", adminPassword : string = "adminadmin") : Promise<boolean> {
        const admin = await User.findOneBy({email: adminLogin});
        if( !admin ) {
            let newAdmin = new User();
            newAdmin.email = adminLogin;
            newAdmin.password = User.hashPassword(adminPassword);
            newAdmin.firstName = "Admin";
            newAdmin.lastName = "FORUM";
            await newAdmin.save();
            return true;
        }
        else{
            return false;
        }
    }

    public static hashPassword(clear : string) : string {
        return crypto.createHash("sha256").update(clear).digest("hex").toString();
    }

}