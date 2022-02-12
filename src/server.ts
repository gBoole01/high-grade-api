import { MongoClient } from 'mongodb';
import dbConnectionURL from './config/db';
import App from "./app";
import PostsController from "./posts/posts.controller";

const mongoClient = MongoClient;
mongoClient.connect(dbConnectionURL, (err) => {
    if (err) {
        throw new Error('DB did not connect !'); // TODO => Create Exception
    }
    console.log('Database Succesfully connected !'); // TODO => Implement better logger
});

const app = new App(
    [
        new PostsController(),
    ],
    5000,
);

app.listen(); // TODO => Chain this action with completion of mongoClient.connect
