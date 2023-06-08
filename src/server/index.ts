import config from "config";
import Express from "express";
import configure from "./configure";

export default class Server {

    private static _app : Express.Application|undefined = undefined;

    /**
     * Init and configure the server
     */
    public static async configure() {
        Server._app = Express();
        return configure(Server._app);
    }

    /**
     * Start the server
     */
    public static async start(){

        // Check if the function configure() has been triggered
        if(Server._app === undefined) throw new Error("Server not configured");

        // Configure listen address and port
        const listen = config.get<string>("server.listen");
        const port = config.get<number>("server.port");

        // start the express server
        Server._app.listen(port, listen, () => {
            console.log(`[*] Server listening at http://${listen}:${port}`)
        })
    }

}