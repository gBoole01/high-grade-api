import validateEnv from './utils/validateEnv';
import App from "./app";
import AuthenticationController from "./authentication/authentication.controller";
import PostsController from "./posts/posts.controller";

validateEnv();

const app = new App(
    [
        new AuthenticationController(),
        new PostsController(),
    ],
    5000,
);

app.listen();
