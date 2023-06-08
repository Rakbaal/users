import Express from "express";
import Model from "../models/user.model";
import authRequired from "../middleware/authRequired";

const router = Express.Router();

/**
 * Return info on the current connected user
 */
router.get("/me", authRequired, async (req: Express.Request, res: Express.Response) => {
    return res.json(res.locals);
})

/**
 * Add new item, must be authenticated
 */
router.post("/", authRequired, async (req: Express.Request, res: Express.Response) => {

    try{
        let item = Model.create(req.body) as Model;
        item.password = Model.hashPassword(item.password!);
        await item.save();
        return res.json({id: item._id});
    }
    catch(e:any){
        return res.status(500).send(e.message);
    }

});


/**
 * Update item, must be authenticated
 */
router.put("/:ID", authRequired, async (req: Express.Request, res: Express.Response) => {

    try{
        let item = await Model.findOneBy({_id: parseInt(req.params.ID) });
        if( !item ) return res.status(404).send("Item not found");

        await Model.update( {_id: item._id} , req.body);

        return res.status(201).json();
    }
    catch(e:any){
        return res.status(500).send(e.message);
    }

});

/**
 * Delete item, must be authenticated
 */
router.delete("/:ID", authRequired, async (req: Express.Request, res: Express.Response) => {

    try{
        let item = await Model.findOneBy({_id: parseInt(req.params.ID) });
        if( !item ) return res.status(404).send("Item not found");

        await Model.remove([item]);
        return res.status(201).json({id: item._id});
    }
    catch(e:any){
        return res.status(500).send(e.message);
    }

});

/**
 * Return all items
 */
router.get("/" , async (req: Express.Request, res: Express.Response) => { 
    return res.json( (await Model.find()) );
});


/**
 * Return item by ID
 */
router.get("/:ID" , async (req: Express.Request, res: Express.Response) => { 
    
    try{
        let item = await Model.findOneBy({_id: parseInt(req.params.ID) });
        if( !item ) return res.status(404).send("Item not found");

        return res.json(item);
    }
    catch(e:any){
        return res.status(500).send(e.message);
    }

});

export default router;