import * as express from 'express';
import * as bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import dbConnectionURL from './config/db';

class App {
    public app: express.Application;
    public port: number;
    public mongoClient: any;
    public dbConnectionURL: string;

    constructor(controllers, port) {
        this.app = express();
        this.port = port;
        this.mongoClient = MongoClient;
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
        this.mongoClient.connect(this.dbConnectionURL, (err) => {
            if (err) {
                throw new Error('DB did not connect !'); // TODO => Create Exception
            }
            console.log('Database Succesfully connected !'); // TODO => Implement better logger
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`); // TODO => Implement better logger
        });
    }
}

export default App;
