import Express from "express";
import Model from "../models/thread.model";
import authRequired from "../middleware/authRequired";
import Post from "../models/post.model";

const router = Express.Router();

/**
 * Add new item, must be authenticated
 */
router.post("/", authRequired, async (req: Express.Request, res: Express.Response) => {

    try{
        let item = Model.create(req.body) as Model;
        item.owner = res.locals._id;

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

        // Delete all post of this thread
        let posts = await Post.findBy({thread_id: item._id});
        await Post.remove(posts);

        // Delete the thread
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

/**
 * Return all messages of the thread
 */
router.get("/:ID/posts" , async (req: Express.Request, res: Express.Response) => { 
    
    try{
        let item = await Model.findOneBy({_id: parseInt(req.params.ID) });
        if( !item ) return res.status(404).send("Item not found");

        
        // Retrieve all post of this thread
        let posts = await Post.findBy({thread_id: item._id});

        return res.json(posts);
    }
    catch(e:any){
        return res.status(500).send(e.message);
    }

});

export default router;