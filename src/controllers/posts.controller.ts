import Express from "express";
import Model from "../models/post.model";
import authRequired from "../middleware/authRequired";
import Thread from "../models/thread.model";

const router = Express.Router();

/**
 * Add new item, must be authenticated
 */
router.post("/", authRequired, async (req: Express.Request, res: Express.Response) => {

    try{
        let item = Model.create(req.body) as Model;
        item.user_id = res.locals._id;
        
        // Check if the thread exists
        let thread = await Thread.findOneBy({_id: item.thread_id});
        if( !thread ) return res.status(404).json("The target thread didn't exists !");

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