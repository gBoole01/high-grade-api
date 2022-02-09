import * as express from 'express';
import * as bodyParser from 'body-parser';

function loggerMiddleware(request: express.Request, response: express.Response, next: express.NextFunction) {
    console.log(`${request.method} ${request.path}`);
    next();
}

const app = express();
const router = express.Router();

router.get('/hello', (request, response) => {
    response.send('Hello world!');
});

router.post('/', (request, response) => {
    response.send(request.body);
});

app.use(loggerMiddleware);
app.use(bodyParser.json());
app.use('/api', router);


app.listen(5000);
