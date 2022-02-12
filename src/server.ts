import App from "./app";
import PostsController from "./posts/posts.controller";
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App(
    [
        new PostsController(),
    ],
    5000,
);

app.listen(); // TODO => Chain this action with completion of mongoClient.connect
