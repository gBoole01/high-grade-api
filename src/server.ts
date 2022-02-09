import * as express from 'express';
import * as bodyParser from 'body-parser';

function loggerMiddleware(request: express.Request, response: express.Response, next: express.NextFunction) {
    console.log(`${request.method} ${request.path}`);
    next();
}

const app = express();


app.use(loggerMiddleware);
app.use(bodyParser.json());

app.get('/hello', (request, response) => {
    response.send('Hello world!');
});

app.post('/', (request, response) => {
    response.send(request.body);
  });

app.listen(5000);
