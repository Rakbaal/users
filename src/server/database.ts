import config from "config";
import { DataSource } from "typeorm";

import User from "../models/user.model";
import Thread from "../models/thread.model";
import Post from "../models/post.model";

const database = new DataSource({
    type: "mariadb",
    host: config.get<string>("db.host"),
    port: config.get<number>("db.port"),
    username: config.get<string>("db.user"),
    password: config.get<string>("db.pass"),
    database: config.get<string>("db.data"),
    synchronize: true,
    entities: [
        User,
        Post,
        Thread
    ]
})

export default database;