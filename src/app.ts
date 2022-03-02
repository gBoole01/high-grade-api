import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as mongoose from 'mongoose';
import dbConnectionURL from './config/db';
import Controller from './interfaces/Controller.interface';
import errorMiddleware from './middlewares/error.middleware';

class App {
    public app: express.Application;

    private port: number;

    private dbConnectionURL: string;

    constructor(controllers: Controller[], port: number) {
        this.app = express();
        this.port = port;
        this.dbConnectionURL = dbConnectionURL;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.connectToTheDatabase();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private connectToTheDatabase(){
        mongoose.connect(this.dbConnectionURL);
    }

    public listen() {
        this.app.listen(this.port, () => {
            // console.log(`App listening on the port ${this.port}`); // TODO => Implement better logger
        });
    }
}

export default App;
