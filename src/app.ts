import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import dbConnectionURL from './config/db';

class App {
    public app: express.Application;
    private port: number;
    private dbConnectionURL: string;

    constructor(controllers, port) {
        this.app = express();
        this.port = port;
        this.dbConnectionURL = dbConnectionURL;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.connectToTheDatabase();
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
    }

    private initializeControllers(controllers) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        });
    }

    private connectToTheDatabase(){
        mongoose.connect(this.dbConnectionURL);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`); // TODO => Implement better logger
        });
    }
}

export default App;
