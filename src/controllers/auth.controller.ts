import Express from "express";
import User from "../models/user.model";
import crypto from "crypto";
const router = Express.Router();

router.post("/login", async (req: Express.Request, res: Express.Response) => {

    const email = req.body.email || null;
    const password = (req.body.password) ? User.hashPassword(req.body.password) : null;

    if( !email || !password ) return res.status(405).send("login or password is missing");

    const user = await User.findOneBy({email, password});
    if( !user ) return res.status(401).send("login or password incorrect");

    return res.json({token: User.generateToken({id: user._id})});

})

export default router;