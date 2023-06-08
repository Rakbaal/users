import Express from "express";
import User from "../models/user.model";

export default async function authRequired(req: Express.Request, res: Express.Response, next: Express.NextFunction) {

    const token = req.headers.authorization || req.query.token || req.body.token || undefined;
    if(token === undefined) return res.status(401).send("Token not provided");

    if( !User.verifyToken(token) ) return res.status(401).send("Token invalid");

    // Found the associated user of the token
    const user = await User.findOneBy({_id: token.id});
    if( !user ) return res.status(401).send("User of the token doesn't exists anymore");

    res.locals = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
    }
    
    next();

}