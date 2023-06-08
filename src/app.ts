import "reflect-metadata";

import Server from "./server";
import User from "./models/user.model";

(async () => {

    await Server.configure();
    await Server.start();

})()