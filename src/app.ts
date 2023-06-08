import "reflect-metadata";

import Server from "./server";

(async () => {

    await Server.configure();
    await Server.start();

})()